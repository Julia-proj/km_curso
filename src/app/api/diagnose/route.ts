import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { featureFlags } from '@/config/feature-flags';
import { isDevBypass } from '@/lib/dev-bypass';
import { SIGN_LABELS } from '@/config/limba-products';
import {
  analyzePhoto,
  calcCost,
  quizAnswersToContext,
  type Diagnostic,
} from '@/lib/ai/diagnose';

function getSupabase() {
  // Dev bypass - return mock client
  if (isDevBypass()) {
    // Return a mock Supabase client for dev mode
    return {
      storage: {
        from: () => ({
          upload: async () => ({ data: { path: 'dev/mock.jpg' }, error: null }),
          createSignedUrl: async () => ({
            data: { signedUrl: 'https://placeholder.com/mock.jpg' },
            error: null
          })
        })
      },
      from: () => ({
        insert: async () => ({ error: null })
      })
    } as any;
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase credentials are not configured');
  }
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '')
    .trim()
    .replace(/\/+$/, '')
    .replace(/\/rest\/v1$/, '');
  return createClient(
    url,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Rate limiting store (in-memory - for production use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const now = Date.now();
  const hourInMs = 60 * 60 * 1000;

  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + hourInMs });
    return true;
  }

  if (record.count >= 3) {
    return false;
  }

  record.count++;
  return true;
}

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'jpg',
  'image/heif': 'jpg',
};

const ALLOWED_MIME_TYPES = new Set(Object.keys(MIME_TO_EXT));

async function uploadImageToSupabase(
  file: File,
  fileName: string
): Promise<{ signedUrl: string; path: string }> {
  // Dev bypass - convert to base64 data URL for OpenAI
  if (isDevBypass()) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    console.log('[uploadImageToSupabase] Dev mode: using base64 data URL');

    return {
      signedUrl: dataUrl,
      path: `dev/${fileName}`
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const supabase = getSupabase();
  const { data, error } = await supabase.storage
    .from('hair-photos')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from('hair-photos')
    .createSignedUrl(data.path, 3600);

  if (signedUrlError) {
    throw new Error(`Failed to create signed URL: ${signedUrlError.message}`);
  }

  return {
    signedUrl: signedUrlData.signedUrl,
    path: data.path,
  };
}

async function saveDiagnosisToSupabase(
  ip: string,
  imagePath: string,
  diagnosis: Diagnostic,
  cost: number
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from('diagnostics').insert({
    ip_address: ip,
    image_path: imagePath,
    damage_level: diagnosis.damage_level,
    signs: diagnosis.visible_signs,
    recommendations: diagnosis.self_care_priorities,
    summary: diagnosis.summary,
    cost: cost,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Failed to save diagnosis to Supabase:', error);
    // Don't throw error here - we still want to return the diagnosis to the user
  }
}

export async function POST(request: NextRequest) {
  // Check if AI diagnostics is enabled
  if (!featureFlags.aiDiagnostics) {
    return NextResponse.json(
      { error: 'AI diagnostics is currently disabled' },
      { status: 503 }
    );
  }

  try {
    // Get client IP
    const ip = getClientIp(request);

    // Check rate limit
    const isAllowed = await checkRateLimit(ip);
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Too many requests. Maximum 3 requests per hour allowed.' },
        { status: 429 }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('photo') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No photo file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Неподдерживаемый формат. Используйте JPG, PNG или WebP.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Optional quiz answers (questionId -> optionId) passed from the client so
    // the model can combine the test with the photo.
    let quizContext;
    const quizRaw = formData.get('quiz');
    if (typeof quizRaw === 'string' && quizRaw.length > 0) {
      try {
        quizContext = quizAnswersToContext(JSON.parse(quizRaw));
      } catch {
        // Malformed quiz payload — fall back to photo-only analysis.
        quizContext = undefined;
      }
    }

    // Generate unique filename — use MIME type for extension, not filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = MIME_TO_EXT[file.type] ?? 'jpg';
    const fileName = `diagnoses/${timestamp}_${randomString}.${fileExtension}`;

    // Upload to Supabase Storage
    const { signedUrl, path } = await uploadImageToSupabase(file, fileName);

    // Analyze with OpenAI (with one retry) — shared analyzePhoto returns the
    // rich diagnostic incl. the recommended Limba category.
    let diagnosis: Diagnostic | null = null;
    let usage: any = null;
    let lastError: string | null = null;

    for (let attempt = 1; attempt <= 2; attempt++) {
      console.log(`[POST] Analysis attempt ${attempt}/2 for file: ${fileName}`);
      const result = await analyzePhoto(signedUrl, quizContext);
      if ('error' in result) {
        lastError = result.error;
        console.error(`[POST] Analysis attempt ${attempt} failed:`, result.error);
        continue;
      }
      diagnosis = result.result;
      usage = result.usage;
      break;
    }

    if (!diagnosis) {
      console.error('[POST] All analysis attempts failed. Last error:', lastError);
      return NextResponse.json(
        { error: lastError || 'Failed to analyze image. Please try again with a different photo.' },
        { status: 500 }
      );
    }

    // Calculate cost
    const cost = calcCost(usage);

    // Save to Supabase (best-effort)
    await saveDiagnosisToSupabase(ip, path, diagnosis, cost);

    // Build the visible-signs list from the controlled main_issues enum (clean
    // Russian via SIGN_LABELS), not the model's free-text visible_signs which can
    // come back as broken/transliterated Russian ("фризз", "тупость").
    const signs = diagnosis.main_issues.map((issue) => SIGN_LABELS[issue] ?? issue);

    // Return result in the shape the diagnostika page expects, plus the AI's
    // Limba category so the care page can use it directly.
    return NextResponse.json({
      damageLevel: diagnosis.damage_level,
      signs,
      recommendations: diagnosis.self_care_priorities,
      summary: diagnosis.summary,
      recommendedCategory: diagnosis.recommended_limba_category,
      secondaryCategory: diagnosis.secondary_limba_category ?? null,
    });

  } catch (error) {
    console.error('[DIAGNOSIS] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

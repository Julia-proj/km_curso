import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { z } from 'zod';
import { featureFlags } from '@/config/feature-flags';

function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase credentials are not configured');
  }
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/\/+$/, '');
  return createClient(
    url,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// Zod schema for validation
const DiagnosisResponseSchema = z.object({
  damageLevel: z.number().min(1).max(5),
  signs: z.array(z.string()).min(1).max(8),
  recommendations: z.array(z.string()).min(1).max(8),
  summary: z.string().min(20).max(500),
});

// System prompt
const SYSTEM_PROMPT = `Ты эксперт-трихолог из студии HAIRLAB в Мадриде.
Анализируй фото волос и давай структурированный, тёплый, профессиональный ответ.
Тон: поддерживающий, без запугивания, без жёстких диагнозов.
Не ставь медицинские диагнозы (алопеция и т.п.).
Фокусируйся на видимых признаках состояния волос и стандартных рекомендациях по уходу.
Используй простой человеческий язык.
Не используй длинные тире.`;

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
  const buffer = Buffer.from(await file.arrayBuffer());
  const supabase = getSupabase();
  console.log('[DIAGNOSIS] upload debug', {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    fileName,
    fileType: file.type,
    fileNameOriginal: file.name,
  });
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

async function analyzeImageWithOpenAI(imageUrl: string): Promise<{
  damageLevel: number;
  signs: string[];
  recommendations: string[];
  summary: string;
}> {
  const openai = getOpenAI();
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Проанализируй это фото волос и верни результат в указанном JSON формате.',
          },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl,
            },
          },
        ],
      },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'hair_diagnosis',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            damageLevel: {
              type: 'number',
              minimum: 1,
              maximum: 5,
              description: 'Уровень повреждения волос от 1 (минимальный) до 5 (сильный)',
            },
            signs: {
              type: 'array',
              items: {
                type: 'string',
              },
              minItems: 1,
              maxItems: 8,
              description: 'Видимые признаки состояния волос',
            },
            recommendations: {
              type: 'array',
              items: {
                type: 'string',
              },
              minItems: 1,
              maxItems: 8,
              description: 'Рекомендации по уходу',
            },
            summary: {
              type: 'string',
              minLength: 20,
              maxLength: 500,
              description: 'Краткое резюме состояния волос',
            },
          },
          required: ['damageLevel', 'signs', 'recommendations', 'summary'],
          additionalProperties: false,
        },
      },
    },
    max_tokens: 1000,
  });
  
  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No content returned from OpenAI');
  }
  
  const parsed = JSON.parse(content);
  return parsed;
}

async function saveDiagnosisToSupabase(
  ip: string,
  imagePath: string,
  diagnosis: z.infer<typeof DiagnosisResponseSchema>,
  tokensUsed: number,
  cost: number
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from('diagnostics').insert({
    ip_address: ip,
    image_path: imagePath,
    damage_level: diagnosis.damageLevel,
    signs: diagnosis.signs,
    recommendations: diagnosis.recommendations,
    summary: diagnosis.summary,
    tokens_used: tokensUsed,
    cost: cost,
    created_at: new Date().toISOString(),
  });
  
  if (error) {
    console.error('Failed to save diagnosis to Supabase:', error);
    // Don't throw error here - we still want to return the diagnosis to the user
  }
}

function calculateCost(tokensUsed: number): number {
  // GPT-4o-mini pricing: $0.15 per 1M input tokens, $0.60 per 1M output tokens
  // Assuming 50/50 split for simplicity
  const inputCost = (tokensUsed * 0.5) * 0.15 / 1_000_000;
  const outputCost = (tokensUsed * 0.5) * 0.60 / 1_000_000;
  return inputCost + outputCost;
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

    console.log('[DIAGNOSIS] File received:', file?.name, file?.size, file?.type);

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

    // Generate unique filename — use MIME type for extension, not filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = MIME_TO_EXT[file.type] ?? 'jpg';
    const fileName = `diagnoses/${timestamp}_${randomString}.${fileExtension}`;
    
    // Upload to Supabase Storage
    console.log('[DIAGNOSIS] Uploading to Supabase...');
    const { signedUrl, path } = await uploadImageToSupabase(file, fileName);
    console.log('[DIAGNOSIS] Upload successful, signed URL generated');

    // Analyze with OpenAI (with retry)
    let diagnosis: z.infer<typeof DiagnosisResponseSchema> | null = null;
    let tokensUsed = 0;
    let retryCount = 0;

    while (retryCount <= 1) {
      try {
        console.log('[DIAGNOSIS] Calling OpenAI API...');
        const result = await analyzeImageWithOpenAI(signedUrl);
        console.log('[DIAGNOSIS] OpenAI response received');

        // Validate with Zod
        const validated = DiagnosisResponseSchema.parse(result);
        diagnosis = validated;

        // Estimate tokens (rough approximation)
        tokensUsed = 1000; // This should come from OpenAI response

        break;
      } catch (error) {
        retryCount++;
        if (retryCount > 1) {
          console.error('OpenAI validation failed after retry:', error);
          return NextResponse.json(
            { error: 'Failed to analyze image. Please try again.' },
            { status: 500 }
          );
        }
      }
    }
    
    if (!diagnosis) {
      return NextResponse.json(
        { error: 'Failed to analyze image. Please try again.' },
        { status: 500 }
      );
    }
    
    // Calculate cost
    const cost = calculateCost(tokensUsed);
    
    // Save to Supabase
    await saveDiagnosisToSupabase(ip, path, diagnosis, tokensUsed, cost);
    
    // Return result
    return NextResponse.json({
      damageLevel: diagnosis.damageLevel,
      signs: diagnosis.signs,
      recommendations: diagnosis.recommendations,
      summary: diagnosis.summary,
    });
    
  } catch (error) {
    console.error('[DIAGNOSIS] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

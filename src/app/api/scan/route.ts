import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { analyzePhoto, calcCost } from '@/lib/ai/diagnose';
import { calculateRecommendation } from '@/lib/recommendations/engine';

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'jpg',
  'image/heif': 'jpg',
};

function getSupabase() {
  // Dev bypass - return mock client
  const isDevBypass = process.env.NEXT_PUBLIC_DEV_BYPASS_PAYWALL === 'true' || 
                     process.env.VERCEL_ENV === 'preview';
  
  if (isDevBypass) {
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

export async function POST(req: NextRequest) {
  try {
    const supabaseAdmin = getSupabase();
    const formData = await req.formData();
    const email = formData.get('email') as string;
    const photo = formData.get('photo') as File;
    const sessionId = formData.get('session_id') as string;
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Невалидный email' }, { status: 400 });
    }
    if (!photo || photo.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Фото нужно, максимум 5MB' }, { status: 400 });
    }
    
    const disposableDomains = ['mailinator.com', '10minutemail.com', 'tempmail.com', 'guerrillamail.com'];
    const emailDomain = email.split('@')[1].toLowerCase();
    if (disposableDomains.includes(emailDomain)) {
      return NextResponse.json({ error: 'Используй основной email' }, { status: 400 });
    }
    
    const { data: existingScans } = await supabaseAdmin
      .from('diagnostics')
      .select('id')
      .eq('user_email', email)
      .limit(1);
    
    if (existingScans && existingScans.length > 0) {
      return NextResponse.json({ 
        error: 'Для этого email анализ уже был сделан. Открой кабинет.' 
      }, { status: 429 });
    }
    
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    const { data: ipScans } = await supabaseAdmin
      .from('diagnostics')
      .select('id, created_at')
      .eq('user_ip', ip)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    
    if (ipScans && ipScans.length >= 3) {
      return NextResponse.json({ 
        error: 'Слишком много запросов. Попробуй позже.' 
      }, { status: 429 });
    }
    
    const ext = MIME_TO_EXT[photo.type] || 'jpg';
    const fileName = `scans/${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${ext}`;
    
    const buffer = Buffer.from(await photo.arrayBuffer());
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('hair-photos')
      .upload(fileName, buffer, { 
        contentType: photo.type,
        cacheControl: '3600'
      });
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'Не удалось загрузить фото' }, { status: 500 });
    }
    
    const { data: signedUrlData } = await supabaseAdmin.storage
      .from('hair-photos')
      .createSignedUrl(uploadData.path, 600);
    
    if (!signedUrlData?.signedUrl) {
      return NextResponse.json({ error: 'Не удалось обработать фото' }, { status: 500 });
    }
    
    let quizData = null;
    if (email || sessionId) {
      const { data: quizResponses } = await supabaseAdmin
        .from('quiz_responses')
        .select('*')
        .or(`user_email.eq.${email},session_id.eq.${sessionId}`)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (quizResponses && quizResponses.length > 0) {
        quizData = quizResponses[0];
      }
    }
    
    const aiResult = await analyzePhoto(signedUrlData.signedUrl, quizData);
    
    if ('error' in aiResult) {
      return NextResponse.json({ error: aiResult.error }, { status: 500 });
    }
    
    const cost = calcCost(aiResult.usage);
    
    const { data: savedDiagnostic, error: diagError } = await supabaseAdmin
      .from('diagnostics')
      .insert({
        user_email: email,
        photo_path: uploadData.path,
        damage_level: aiResult.result.damage_level,
        signs: aiResult.result.visible_signs,
        recommendations: aiResult.result.self_care_priorities,
        summary: aiResult.result.summary,
        ai_provider: 'openai',
        cost_usd: cost,
        user_ip: ip,
        source: 'landing'
      })
      .select()
      .single();
    
    if (diagError || !savedDiagnostic) {
      console.error('Save diagnostic error:', diagError);
      return NextResponse.json({ error: 'Не удалось сохранить' }, { status: 500 });
    }
    
    const { data: products } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('order_index');
    
    const recommendation = await calculateRecommendation(
      aiResult.result,
      quizData,
      products || []
    );
    
    const { data: savedRec, error: recError } = await supabaseAdmin
      .from('recommendations')
      .insert({
        user_email: email,
        quiz_response_id: quizData?.id || null,
        diagnostic_id: savedDiagnostic.id,
        primary_category: recommendation.primary_category,
        secondary_category: recommendation.secondary_category,
        recommended_product_ids: recommendation.product_ids,
        recommended_gift_ids: recommendation.gift_ids,
        reasoning_summary: recommendation.reasoning_summary,
        reasoning_details: recommendation.reasoning_details
      })
      .select()
      .single();
    
    await supabaseAdmin
      .from('leads')
      .upsert({ 
        email, 
        source: 'ai_scanner' 
      }, { onConflict: 'email' });
    
    return NextResponse.json({
      success: true,
      diagnostic: {
        damage_level: aiResult.result.damage_level,
        visible_signs: aiResult.result.visible_signs,
        main_issues: aiResult.result.main_issues,
        summary: aiResult.result.summary,
        self_care_priorities: aiResult.result.self_care_priorities
      },
      recommendation: {
        ...recommendation,
        recommendation_id: savedRec?.id,
        products: products?.filter((p: any) => recommendation.product_ids.includes(p.id)),
        gifts: products?.filter((p: any) => recommendation.gift_ids.includes(p.id))
      },
      had_quiz: !!quizData
    });
    
  } catch (error: any) {
    console.error('Scan endpoint error:', error);
    return NextResponse.json({ error: 'Что-то пошло не так' }, { status: 500 });
  }
}

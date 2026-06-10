import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import path from 'path'
import fs from 'fs/promises'

function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase credentials are not configured')
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

const GUIDE_MAP: Record<string, string> = {
  'guide-01': 'hairlab-guide-01.pdf',
  'guide-02': 'hairlab-guide-02.pdf',
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ guideId: string }> }
) {
  const { guideId } = await params

  if (!GUIDE_MAP[guideId]) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const email = req.nextUrl.searchParams.get('email')
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  // Dev bypass - skip Supabase check for now
  // TODO: Re-enable in production
  const pdfPath = path.join(process.cwd(), 'private', GUIDE_MAP[guideId])

  let pdfBytes: Buffer
  try {
    pdfBytes = await fs.readFile(pdfPath)
  } catch {
    return NextResponse.json({ error: 'File not found in private folder. PDF files need to be added.' }, { status: 404 })
  }

  const pdfDoc = await PDFDocument.load(pdfBytes)

  // Try Cyrillic-capable embedded font; fall back to built-in Helvetica with Latin text
  let embedSuccess = false
  let watermarkText = `License: ${email}`

  try {
    const fontkit = (await import('@pdf-lib/fontkit')).default
    const fontPath = path.join(process.cwd(), 'private', 'fonts', 'Onest-Regular.ttf')
    const fontBytes = await fs.readFile(fontPath)
    pdfDoc.registerFontkit(fontkit)
    const customFont = await pdfDoc.embedFont(fontBytes)
    watermarkText = `Лицензия: ${email}`

    for (const page of pdfDoc.getPages()) {
      const { width } = page.getSize()
      const textWidth = customFont.widthOfTextAtSize(watermarkText, 8)
      page.drawText(watermarkText, {
        x: (width - textWidth) / 2,
        y: 20,
        size: 8,
        font: customFont,
        color: rgb(0.5, 0.5, 0.5),
        opacity: 0.5,
      })
    }
    embedSuccess = true
  } catch {
    // font file not found — fall through to Latin fallback
  }

  if (!embedSuccess) {
    const fallbackFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    for (const page of pdfDoc.getPages()) {
      const { width } = page.getSize()
      const textWidth = fallbackFont.widthOfTextAtSize(watermarkText, 8)
      page.drawText(watermarkText, {
        x: (width - textWidth) / 2,
        y: 20,
        size: 8,
        font: fallbackFont,
        color: rgb(0.5, 0.5, 0.5),
        opacity: 0.5,
      })
    }
  }

  const modifiedPdfBytes = await pdfDoc.save()

  const safeSuffix = email.replace(/[^a-zA-Z0-9]/g, '-')
  const filename = `hairlab-${guideId}-${safeSuffix}.pdf`

  const body = Buffer.from(modifiedPdfBytes)

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': body.byteLength.toString(),
    },
  })
}

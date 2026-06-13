import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { isDevBypass } from '@/lib/dev-bypass'
import { isAdminEmail } from '@/lib/admin'
import { PDFDocument, PDFFont, rgb, StandardFonts } from 'pdf-lib'
import path from 'path'
import fs from 'fs/promises'

const GUIDE_MAP: Record<string, string> = {
  'guide-01': '.hairlab-guide-01.pdf',
  'guide-02': 'hairlab-guide-02.pdf',
}

/**
 * Resolve the requester from the session and confirm they actually bought
 * access (methodichka or full course; admins and dev bypass excepted).
 * The email is taken from the session, never the query string — otherwise
 * anyone with the URL could download the PDF and stamp any email on it.
 * Returns the email to watermark, or null when unauthorized.
 */
async function resolveAuthorizedEmail(): Promise<string | null> {
  if (isDevBypass()) return 'dev@example.com'

  const auth = await createServerSupabase()
  if (!auth) return null

  const { data: { user } } = await auth.auth.getUser()
  if (!user?.email) return null
  const email = user.email

  // Admins get access without a purchase.
  if (isAdminEmail(email)) return email

  // Both methodichka and full-course buyers get the PDFs.
  const supabase = getSupabase()
  const { data } = await supabase
    .from('profiles')
    .select('has_methodichka, has_full_course')
    .eq('email', email)
    .single()

  if (data && (data.has_methodichka || data.has_full_course)) return email
  return null
}

/** Draw a small, centred licence note at the bottom of every page. */
function stampOnEveryPage(pdfDoc: PDFDocument, font: PDFFont, text: string) {
  for (const page of pdfDoc.getPages()) {
    const { width } = page.getSize()
    const textWidth = font.widthOfTextAtSize(text, 8)
    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: 20,
      size: 8,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity: 0.5,
    })
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ guideId: string }> }
) {
  const { guideId } = await params

  if (!GUIDE_MAP[guideId]) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const email = await resolveAuthorizedEmail()
  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const pdfPath = path.join(process.cwd(), 'private', GUIDE_MAP[guideId])

  let pdfBytes: Buffer
  try {
    pdfBytes = await fs.readFile(pdfPath)
  } catch {
    return NextResponse.json({ error: 'File not found in private folder. PDF files need to be added.' }, { status: 404 })
  }

  const pdfDoc = await PDFDocument.load(pdfBytes)

  // Prefer a Cyrillic-capable embedded font; fall back to built-in Helvetica
  // with a Latin-only label if that font file isn't available.
  let font: PDFFont
  let watermarkText: string
  try {
    const fontkit = (await import('@pdf-lib/fontkit')).default
    const fontBytes = await fs.readFile(
      path.join(process.cwd(), 'private', 'fonts', 'Onest-Regular.ttf')
    )
    pdfDoc.registerFontkit(fontkit)
    font = await pdfDoc.embedFont(fontBytes)
    watermarkText = `Лицензия: ${email}`
  } catch {
    font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    watermarkText = `License: ${email}`
  }

  stampOnEveryPage(pdfDoc, font, watermarkText)

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

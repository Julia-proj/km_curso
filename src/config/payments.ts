const PAYMENT_FALLBACKS = {
  course: "/offer?product=course",
  guide: "/offer?product=guide",
} as const

type PaymentProduct = keyof typeof PAYMENT_FALLBACKS

export function getPaymentLink(product: PaymentProduct): string {
  const envKey =
    product === "course" ? process.env.NEXT_PUBLIC_STRIPE_COURSE_URL : process.env.NEXT_PUBLIC_STRIPE_GUIDE_URL

  if (envKey && envKey.trim().length > 0) {
    return envKey
  }

  return PAYMENT_FALLBACKS[product]
}

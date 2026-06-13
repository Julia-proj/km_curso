export interface Product {
  id: string
  name: string
  price: number
  currency: string
  stripePriceId: string
  description: string
}

export const products: Record<string, Product> = {
  course: {
    id: 'course',
    name: 'HAIRLAB Full Course',
    price: 38,
    currency: 'EUR',
    stripePriceId: process.env.STRIPE_PRICE_COURSE || '',
    description: 'Видео-уроки + AI-диагностика + личный кабинет + методички в PDF',
  },
  guide: {
    id: 'guide',
    name: 'HAIRLAB KM Guide',
    price: 12,
    currency: 'EUR',
    stripePriceId: process.env.STRIPE_PRICE_GUIDE || '',
    description: 'Две методички в PDF: основной уход (81 стр.) и аксессуары (19 стр.)',
  },
}
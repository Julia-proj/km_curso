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
    price: 39,
    currency: 'EUR',
    stripePriceId: process.env.STRIPE_PRICE_COURSE || '',
    description: 'Видео-уроки + AI-диагностика + личный кабинет + KM Guide',
  },
  guide: {
    id: 'guide',
    name: 'HAIRLAB KM Guide',
    price: 13,
    currency: 'EUR',
    stripePriceId: process.env.STRIPE_PRICE_GUIDE || '',
    description: 'PDF-гайд, 32 страницы',
  },
}
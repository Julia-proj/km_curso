export interface StripeProduct {
  name: string
  description?: string
  price_eur: number
}

export interface ApiErrorResponse {
  error: string
}

export interface OrderSessionResponse {
  status: 'paid' | 'processing'
  customer_name: string | null
  amount_total: number | null
  currency: string | null
  pickup_location: string | null
  items: Array<{ name: string; quantity: number }>
  order_id?: string
}

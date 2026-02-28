// Types for the entire application

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  imageUrl?: string
}

export interface ShippingAddress {
  fullName: string
  address: string
  city: string
  postalCode: string
  phone: string
}

export interface CreditCard {
  number: string
  holderName: string
  expiryDate: string
  cvv: string
  cardType?: 'visa' | 'mastercard'
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CheckoutRequest {
  productId: string
  quantity: number
  shippingAddress: ShippingAddress
  paymentInfo: {
    cardNumber: string
    cardHolder: string
    expiryDate: string
    cvv: string
  }
}

export interface CheckoutResponse {
  transactionId: string
  status: 'PENDING' | 'APPROVED' | 'DECLINED'
  amount: number
  timestamp: string
}

export interface TransactionStatus {
  transactionId: string
  status: 'PENDING' | 'APPROVED' | 'DECLINED'
  amount: number
  timestamp: string
}

export interface AuthState {
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export interface ProductsState {
  items: Product[]
  loading: boolean
  error: string | null
}

export interface CartState {
  items: CartItem[]
  shippingAddress: ShippingAddress | null
  paymentInfo: CreditCard | null
}

export interface CheckoutState {
  transaction: CheckoutResponse | null
  loading: boolean
  error: string | null
  pollingActive: boolean
}

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
  addressLine1: string
  city: string
  region: string
  country: string
  recipientName: string
  recipientPhone: string
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
  acceptanceToken: string
  items: Array<{ productId: string; quantity: number }>
  paymentMethod: {
    type: 'CARD'
    cardData: {
      number: string
      cvc: string
      exp_month: string
      exp_year: string
      card_holder: string
    }
    installments: number
  }
  shippingAddress: ShippingAddress
  customerEmail: string
}

export interface CheckoutResponse {
  statusCode: number
  message: string
  data: {
    transactionId: string
    status: 'PENDING' | 'APPROVED' | 'DECLINED'
    amount: number
    currency: string
    reference: string
    paymentMethod: string
    wompiTransactionId: string
    statusToken: string
    errorMessage: string | null
  }
}

export interface TransactionStatus {
  statusCode: number
  message: string
  data: {
    transactionId: string
    wompiTransactionId: string
    status: 'PENDING' | 'APPROVED' | 'DECLINED'
    amount: number
    reference: string
    paymentMethod: string
    errorMessage: string | null
    redirectUrl: string
    statusMessage: string | null
    merchant: {
      id: number
      name: string
      legal_name: string
      contact_name: string
      phone_number: string
      logo_url: string | null
      legal_id_type: string
      email: string
      legal_id: string
      public_key: string
    }
  }
}

// Types for data returned by async thunks (without API wrapper)
export type CheckoutData = CheckoutResponse['data']
export type TransactionStatusData = TransactionStatus['data']

export interface WompiAcceptanceResponse {
  data: {
    presigned_acceptance: {
      acceptance_token: string
      permalink: string
      type: string
    }
  }
}

// Auth Types
export interface User {
  id: string
  email: string
  roleId: string
  roleName: string
}

export interface Customer {
  id: string
  firstName: string
  lastName: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface LoginResponse {
  statusCode: number
  message: string
  data: {
    user: User
    accessToken: string
  }
}

export interface RegisterResponse {
  statusCode: number
  message: string
  data: {
    user: User
    customer: Customer
    accessToken: string
  }
}

export interface AuthState {
  token: string | null
  user: User | null
  customer: Customer | null
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
  customerEmail: string | null
  acceptanceToken: string | null
  acceptancePermalink: string | null
  transactionId: string | null
  wompiTransactionId: string | null
  statusToken: string | null
  transactionStatus: 'PENDING' | 'APPROVED' | 'DECLINED' | null
  checkoutLoading: boolean
  checkoutError: string | null
  isPolling: boolean
}

export interface CheckoutState {
  transaction: CheckoutData | null
  loading: boolean
  error: string | null
  pollingActive: boolean
}

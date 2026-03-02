import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import API_CONFIG from '@/config/api'
import {
  CartState,
  Product,
  ShippingAddress,
  CreditCard,
  WompiAcceptanceResponse,
  CheckoutRequest,
  CheckoutResponse,
  TransactionStatus,
} from '@/types'

const initialState: CartState = {
  items: [],
  shippingAddress: null,
  paymentInfo: null,
  customerEmail: null,
  acceptanceToken: null,
  acceptancePermalink: null,
  transactionId: null,
  wompiTransactionId: null,
  transactionStatus: null,
  checkoutLoading: false,
  checkoutError: null,
  isPolling: false,
}

// Async Thunks
export const fetchAcceptanceToken = createAsyncThunk(
  'cart/fetchAcceptanceToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_CONFIG.wompiApiUrl}/merchants/${API_CONFIG.wompiPublicKey}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch acceptance token')
      }
      
      const data: WompiAcceptanceResponse = await response.json()
      return {
        acceptanceToken: data.data.presigned_acceptance.acceptance_token,
        acceptancePermalink: data.data.presigned_acceptance.permalink,
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }
)

export const submitCheckout = createAsyncThunk(
  'cart/submitCheckout',
  async (checkoutData: CheckoutRequest, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      })
      
      if (!response.ok) {
        throw new Error('Checkout failed')
      }
      
      const data: CheckoutResponse = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }
)

export const checkTransactionStatus = createAsyncThunk(
  'cart/checkTransactionStatus',
  async (wompiTransactionId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/api/checkout/status/${wompiTransactionId}`)
      
      if (!response.ok) {
        throw new Error('Failed to check transaction status')
      }
      
      const data: TransactionStatus = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.product.id
      )
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push({
          product: action.payload.product,
          quantity: action.payload.quantity,
        })
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload)
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) => item.product.id === action.payload.productId
      )
      if (item) {
        item.quantity = action.payload.quantity
      }
    },
    clearCart: (state) => {
      state.items = []
    },
    setShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload
    },
    setPaymentInfo: (state, action: PayloadAction<CreditCard>) => {
      state.paymentInfo = action.payload
    },
    setCustomerEmail: (state, action: PayloadAction<string>) => {
      state.customerEmail = action.payload
    },
    setPolling: (state, action: PayloadAction<boolean>) => {
      state.isPolling = action.payload
    },
    resetCheckout: (state) => {
      state.acceptanceToken = null
      state.acceptancePermalink = null
      state.transactionId = null
      state.wompiTransactionId = null
      state.transactionStatus = null
      state.checkoutLoading = false
      state.checkoutError = null
      state.isPolling = false
    },
    clearCartData: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch Acceptance Token
    builder
      .addCase(fetchAcceptanceToken.pending, (state) => {
        state.checkoutLoading = true
        state.checkoutError = null
      })
      .addCase(fetchAcceptanceToken.fulfilled, (state, action) => {
        state.checkoutLoading = false
        state.acceptanceToken = action.payload.acceptanceToken
        state.acceptancePermalink = action.payload.acceptancePermalink
      })
      .addCase(fetchAcceptanceToken.rejected, (state, action) => {
        state.checkoutLoading = false
        state.checkoutError = action.payload as string
      })

    // Submit Checkout
    builder
      .addCase(submitCheckout.pending, (state) => {
        state.checkoutLoading = true
        state.checkoutError = null
      })
      .addCase(submitCheckout.fulfilled, (state, action) => {
        state.checkoutLoading = false
        state.transactionId = action.payload.data.transactionId
        state.wompiTransactionId = action.payload.data.wompiTransactionId
        state.transactionStatus = action.payload.data.status
      })
      .addCase(submitCheckout.rejected, (state, action) => {
        state.checkoutLoading = false
        state.checkoutError = action.payload as string
      })

    // Check Transaction Status
    builder
      .addCase(checkTransactionStatus.pending, (state) => {
        state.checkoutError = null
      })
      .addCase(checkTransactionStatus.fulfilled, (state, action) => {
        state.transactionStatus = action.payload.data.status
      })
      .addCase(checkTransactionStatus.rejected, (state, action) => {
        state.checkoutError = action.payload as string
        state.isPolling = false
      })
  },
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setShippingAddress,
  setPaymentInfo,
  setCustomerEmail,
  setPolling,
  resetCheckout,
  clearCartData,
} = cartSlice.actions

export default cartSlice.reducer

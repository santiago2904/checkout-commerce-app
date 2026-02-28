import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartState, Product, ShippingAddress, CreditCard } from '@/types'

const initialState: CartState = {
  items: [],
  shippingAddress: null,
  paymentInfo: null,
}

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
    clearCartData: () => initialState,
  },
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setShippingAddress,
  setPaymentInfo,
  clearCartData,
} = cartSlice.actions

export default cartSlice.reducer

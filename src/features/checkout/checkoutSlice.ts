import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { CheckoutState, CheckoutRequest, CheckoutResponse, TransactionStatus } from '@/types'
import { RootState } from '@/store/store'

const API_BASE_URL = 'http://localhost:3000/api'

// Interface para la respuesta de la API
interface ApiResponse<T> {
  statusCode: number
  data: T
}

// Async thunk para crear checkout
export const createCheckout = createAsyncThunk(
  'checkout/create',
  async (checkoutData: CheckoutRequest, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const response = await axios.post<ApiResponse<CheckoutResponse>>(
        `${API_BASE_URL}/checkout`,
        checkoutData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error en el checkout'
      )
    }
  }
)

// Async thunk para verificar el estado de la transacción
export const checkTransactionStatus = createAsyncThunk(
  'checkout/checkStatus',
  async (transactionId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const response = await axios.get<ApiResponse<TransactionStatus>>(
        `${API_BASE_URL}/checkout/status/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al verificar estado'
      )
    }
  }
)

const initialState: CheckoutState = {
  transaction: null,
  loading: false,
  error: null,
  pollingActive: false,
}

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    clearCheckout: () => initialState,
    setPollingActive: (state, action: PayloadAction<boolean>) => {
      state.pollingActive = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Create checkout
      .addCase(createCheckout.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCheckout.fulfilled, (state, action: PayloadAction<CheckoutResponse>) => {
        state.loading = false
        state.transaction = action.payload
        state.error = null
        // Activar polling si el estado es PENDING
        if (action.payload.status === 'PENDING') {
          state.pollingActive = true
        }
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Check status
      .addCase(checkTransactionStatus.fulfilled, (state, action: PayloadAction<TransactionStatus>) => {
        if (state.transaction) {
          state.transaction.status = action.payload.status
          // Desactivar polling si el estado ya no es PENDING
          if (action.payload.status !== 'PENDING') {
            state.pollingActive = false
          }
        }
      })
  },
})

export const { clearCheckout, setPollingActive } = checkoutSlice.actions
export default checkoutSlice.reducer

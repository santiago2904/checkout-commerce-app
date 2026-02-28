import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { Product, ProductsState } from '@/types'
import { RootState } from '@/store/store'

const API_BASE_URL = 'http://localhost:3000/api'

// Interface para la respuesta de la API
interface ApiResponse<T> {
  statusCode: number
  data: T
}

// Async thunk para obtener productos
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const response = await axios.get<ApiResponse<Product[]>>(`${API_BASE_URL}/products`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      // La API devuelve { statusCode: 200, data: [...] }
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al cargar productos'
      )
    }
  }
)

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductsError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false
        state.items = action.payload
        state.error = null
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearProductsError } = productsSlice.actions
export default productsSlice.reducer

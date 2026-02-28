import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { AuthState } from '@/types'

const API_BASE_URL = 'http://localhost:3000/api'

// Interface para la respuesta de la API
interface ApiResponse<T> {
  statusCode: number
  data: T
}

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  token: string
}

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse<LoginResponse>>(
        `${API_BASE_URL}/auth/login`,
        credentials
      )
      return response.data.data.token
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login fallido')
    }
  }
)

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null
      state.isAuthenticated = false
      state.error = null
    },
    clearAuthError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.token = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer

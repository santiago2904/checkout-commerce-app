import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { AuthState, LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '@/types'
import API_CONFIG from '@/config/api'

// Async thunk for login
export const login = createAsyncThunk<
  LoginResponse['data'],
  LoginRequest,
  { rejectValue: string }
>(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_CONFIG.baseUrl}/api/auth/login`,
        credentials
      )
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Login fallido'
      )
    }
  }
)

// Async thunk for register
export const register = createAsyncThunk<
  RegisterResponse['data'],
  RegisterRequest,
  { rejectValue: string }
>(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post<RegisterResponse>(
        `${API_CONFIG.baseUrl}/api/auth/register`,
        userData
      )
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Registro fallido'
      )
    }
  }
)

const initialState: AuthState = {
  token: null,
  user: null,
  customer: null,
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
      state.user = null
      state.customer = null
      state.isAuthenticated = false
      state.error = null
    },
    clearAuthError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.accessToken
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.accessToken
        state.user = action.payload.user
        state.customer = action.payload.customer
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer

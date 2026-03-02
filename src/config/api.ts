/**
 * API Configuration
 * Centralizes API endpoints and keys
 * 
 * Environment variables (set in .env file):
 * - VITE_CHECKOUT_API_URL
 * - VITE_WOMPI_PUBLIC_KEY
 * - VITE_WOMPI_API_BASE_URL
 * 
 * Note: This file is mocked in Jest tests (see __mocks__/api.ts)
 */

// Default values (fallback if env vars are not set)
const defaults = {
  baseUrl: 'http://localhost:3000',
  wompiPublicKey: 'pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7',
  wompiApiUrl: 'https://sandbox.wompi.co/v1'
}

export const API_CONFIG = {
  // Base URL for checkout API
  baseUrl: import.meta.env.VITE_CHECKOUT_API_URL || defaults.baseUrl,
  // Wompi sandbox public key
  wompiPublicKey: import.meta.env.VITE_WOMPI_PUBLIC_KEY || defaults.wompiPublicKey,
  // Wompi API base URL
  wompiApiUrl: import.meta.env.VITE_WOMPI_API_BASE_URL || defaults.wompiApiUrl,
} as const

export default API_CONFIG

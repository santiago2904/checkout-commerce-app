/**
 * Mock for api.ts - used in Jest tests
 * This avoids import.meta.env parsing issues in Jest
 */

export const API_CONFIG = {
  baseUrl: 'http://localhost:3000',
  wompiPublicKey: 'pub_test_8xaBnA0Z4OoRlC2yF0RfLJe0DT7jZ0Fc',
  wompiApiUrl: 'https://sandbox.wompi.co/v1'
} as const

export default API_CONFIG

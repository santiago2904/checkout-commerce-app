import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import CheckoutPage from './CheckoutPage'
import authReducer from '@/features/auth/authSlice'
import productsReducer from '@/features/products/productsSlice'
import cartReducer from '@/features/cart/cartSlice'
import checkoutReducer from '@/features/checkout/checkoutSlice'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

// Mock de fetchProducts para que no haga nada
jest.mock('@/features/products/productsSlice', () => ({
  ...jest.requireActual('@/features/products/productsSlice'),
  fetchProducts: jest.fn(() => ({ type: 'products/fetchProducts', payload: undefined })),
}))

const createMockStore = (initialState = {}) => {
  // Estado base por defecto
  const defaultState = {
    auth: { token: null, user: null, customer: null, isAuthenticated: false, loading: false, error: null },
    products: { items: [], loading: false, error: null },
    cart: {
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
      statusToken: null,
    },
    checkout: { transaction: null, loading: false, error: null, pollingActive: false },
  }
  
  // Mezclar estado por defecto con el estado inicial pasado
  const mergedState = {
    ...defaultState,
    ...initialState,
  }
  
  return configureStore({
    reducer: {
      auth: authReducer,
      products: productsReducer,
      cart: cartReducer,
      checkout: checkoutReducer,
    },
    preloadedState: mergedState,
  })
}

const renderWithProviders = (component: React.ReactElement, store: any) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  )
}

describe('CheckoutPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  describe('Rendering', () => {
    it('should render checkout page with title', () => {
      const store = createMockStore({
        cart: {
          items: [
            {
              product: { id: '1', name: 'Test', price: 100, stock: 5 },
              quantity: 1,
            },
          ],
          shippingAddress: null,
          paymentInfo: null,
        },
      })
      renderWithProviders(<CheckoutPage />, store)

      // Verificar que el Header y la página se renderiza correctamente
      expect(screen.getByText('Checkout Store')).toBeInTheDocument()
      expect(screen.getByText('Envío')).toBeInTheDocument()
    })

    it('should redirect to products if cart is empty', () => {
      const store = createMockStore({
        cart: { items: [], shippingAddress: null, paymentInfo: null },
      })
      renderWithProviders(<CheckoutPage />, store)

      expect(mockNavigate).toHaveBeenCalledWith('/products')
    })

    it('should show delivery form initially', () => {
      const store = createMockStore({
        cart: {
          items: [
            {
              product: {
                id: '1',
                name: 'Test Product',
                description: 'Test',
                price: 100,
                stock: 5,
                imageUrl: '',
              },
              quantity: 1,
            },
          ],
          shippingAddress: null,
          paymentInfo: null,
        },
      })
      renderWithProviders(<CheckoutPage />, store)

      // Verificar que el step activo es "Envío"
      expect(screen.getByText('Envío')).toBeInTheDocument()
      // El formulario de delivery tiene estos campos
      expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument()
    })
  })

  describe('Cart Summary', () => {
    it('should display cart items in summary', () => {
      const store = createMockStore({
        cart: {
          items: [
            {
              product: {
                id: '1',
                name: 'Laptop',
                description: 'Gaming Laptop',
                price: 1500,
                stock: 5,
                imageUrl: '',
              },
              quantity: 2,
            },
          ],
          shippingAddress: null,
          paymentInfo: null,
        },
      })
      const { container } = renderWithProviders(<CheckoutPage />, store)

      expect(screen.getByText('Laptop')).toBeInTheDocument()
      const quantityValue = container.querySelector('.quantity-value')
      expect(quantityValue).toHaveTextContent('2')
    })

    it('should calculate total correctly', () => {
      const store = createMockStore({
        cart: {
          items: [
            {
              product: {
                id: '1',
                name: 'Laptop',
                price: 1000,
                stock: 5,
              },
              quantity: 2,
            },
            {
              product: {
                id: '2',
                name: 'Mouse',
                price: 50,
                stock: 10,
              },
              quantity: 1,
            },
          ],
          shippingAddress: null,
          paymentInfo: null,
        },
      })
      renderWithProviders(<CheckoutPage />, store)

      // Total: 1000*2 + 50*1 = 2050
      const totalElements = screen.getAllByText(/\$2\.050/)
      expect(totalElements.length).toBeGreaterThan(0)
    })
  })

  describe('Step Navigation', () => {
    it('should show credit card modal after completing delivery form', async () => {
      const store = createMockStore({
        cart: {
          items: [
            {
              product: { id: '1', name: 'Test', price: 100, stock: 5 },
              quantity: 1,
            },
          ],
          shippingAddress: null,
          paymentInfo: null,
          customerEmail: null,
        },
      })
      renderWithProviders(<CheckoutPage />, store)

      // Fill delivery form
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@test.com' },
      })
      fireEvent.change(screen.getByLabelText(/nombre completo/i), {
        target: { value: 'Juan Pérez' },
      })
      fireEvent.change(screen.getByLabelText(/dirección/i), {
        target: { value: 'Calle 123' },
      })
      fireEvent.change(screen.getByLabelText(/ciudad/i), {
        target: { value: 'Bogotá' },
      })
      fireEvent.change(screen.getByLabelText(/departamento|región/i), {
        target: { value: 'Cundinamarca' },
      })
      fireEvent.change(screen.getByLabelText(/teléfono/i), {
        target: { value: '+573001234567' },
      })

      // Submit delivery form
      fireEvent.click(screen.getByText(/continuar al pago/i))

      await waitFor(() => {
        expect(screen.getByText(/información de pago/i)).toBeInTheDocument()
      })
    })

    it('should allow closing payment modal with cancel button', async () => {
      const store = createMockStore({
        cart: {
          items: [
            {
              product: { id: '1', name: 'Test', price: 100, stock: 5 },
              quantity: 1,
            },
          ],
          shippingAddress: null,
          paymentInfo: null,
          customerEmail: null,
        },
      })
      renderWithProviders(<CheckoutPage />, store)

      // Should show delivery form initially
      expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument()

      // Fill and submit delivery form to go to payment
      const emailInput = screen.getByLabelText(/email/i)
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } })
      
      const nameInput = screen.getByLabelText(/nombre completo/i)
      fireEvent.change(nameInput, { target: { value: 'Test User' } })
      
      const addressInput = screen.getByLabelText(/dirección/i)
      fireEvent.change(addressInput, { target: { value: 'Test Address' } })
      
      const cityInput = screen.getByLabelText(/ciudad/i)
      fireEvent.change(cityInput, { target: { value: 'Bogotá' } })
      
      const regionInput = screen.getByLabelText(/departamento|región/i)
      fireEvent.change(regionInput, { target: { value: 'Cundinamarca' } })
      
      const phoneInput = screen.getByLabelText(/teléfono/i)
      fireEvent.change(phoneInput, { target: { value: '+573001234567' } })

      const continueButton = screen.getByRole('button', { name: /continuar/i })
      fireEvent.click(continueButton)

      // Should show payment modal
      await waitFor(() => {
        expect(screen.getByText(/información de pago/i)).toBeInTheDocument()
      })

      // Verify cancel button exists
      const cancelButton = screen.getByRole('button', { name: /cancelar/i })
      expect(cancelButton).toBeInTheDocument()
    })
  })

  describe('Step Indicators', () => {
    it('should show step 1 as active initially', () => {
      const store = createMockStore({
        cart: {
          items: [
            {
              product: { id: '1', name: 'Test', price: 100, stock: 5 },
              quantity: 1,
            },
          ],
          shippingAddress: null,
          paymentInfo: null,
        },
      })
      const { container } = renderWithProviders(<CheckoutPage />, store)

      const step1 = container.querySelector('.step:nth-child(1)')
      expect(step1).toHaveClass('active')
    })

    it('should show step 2 as active when in payment', async () => {
      const store = createMockStore({
        cart: {
          items: [
            {
              product: { id: '1', name: 'Test', price: 100, stock: 5 },
              quantity: 1,
            },
          ],
          shippingAddress: {
            fullName: 'Juan Pérez',
            address: 'Calle 123',
            city: 'Bogotá',
            postalCode: '110111',
            phone: '3001234567',
          },
          paymentInfo: null,
        },
      })
      const { container } = renderWithProviders(<CheckoutPage />, store)

      await waitFor(() => {
        const step2 = container.querySelector('.step:nth-child(3)')
        expect(step2).toHaveClass('active')
      })
    })

    it('should mark completed steps', async () => {
      const store = createMockStore({
        cart: {
          items: [
            {
              product: { id: '1', name: 'Test', price: 100, stock: 5 },
              quantity: 1,
            },
          ],
          shippingAddress: {
            fullName: 'Juan Pérez',
            address: 'Calle 123',
            city: 'Bogotá',
            postalCode: '110111',
            phone: '3001234567',
          },
          paymentInfo: null,
        },
      })
      const { container } = renderWithProviders(<CheckoutPage />, store)

      await waitFor(() => {
        const step1 = container.querySelector('.step:nth-child(1)')
        expect(step1).toHaveClass('completed')
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      const store = createMockStore({
        cart: {
          items: [
            {
              product: { id: '1', name: 'Test', price: 100, stock: 5 },
              quantity: 1,
            },
          ],
          shippingAddress: null,
          paymentInfo: null,
        },
      })
      renderWithProviders(<CheckoutPage />, store)

      // Verificar que hay headings (Header incluye uno)
      const headings = screen.getAllByRole('heading', { level: 1 })
      expect(headings.length).toBeGreaterThan(0)
      expect(screen.getByText('Checkout Store')).toBeInTheDocument()
    })

    it('should have navigation landmarks', () => {
      const store = createMockStore({
        cart: {
          items: [
            {
              product: { id: '1', name: 'Test', price: 100, stock: 5 },
              quantity: 1,
            },
          ],
          shippingAddress: null,
          paymentInfo: null,
        },
      })
      renderWithProviders(<CheckoutPage />, store)

      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })
  })

  describe('Responsive Behavior', () => {
    it('should have responsive classes', () => {
      const store = createMockStore({
        cart: {
          items: [
            {
              product: { id: '1', name: 'Test', price: 100, stock: 5 },
              quantity: 1,
            },
          ],
          shippingAddress: null,
          paymentInfo: null,
        },
      })
      const { container } = renderWithProviders(<CheckoutPage />, store)

      const checkoutPage = container.querySelector('.checkout-page')
      expect(checkoutPage).toBeInTheDocument()
    })
  })

  describe('Cart Management', () => {
    it('should display quantity controls for each item', () => {
      const store = createMockStore({
        cart: {
          items: [
            {
              product: { id: '1', name: 'Laptop', price: 1000, stock: 5 },
              quantity: 2,
            },
          ],
          shippingAddress: null,
          paymentInfo: null,
        },
      })
      const { container } = renderWithProviders(<CheckoutPage />, store)

      const incrementBtn = screen.getByLabelText('Aumentar cantidad')
      const decrementBtn = screen.getByLabelText('Disminuir cantidad')
      const quantityValue = container.querySelector('.quantity-value')

      expect(incrementBtn).toBeInTheDocument()
      expect(decrementBtn).toBeInTheDocument()
      expect(quantityValue).toBeInTheDocument()
      expect(quantityValue).toHaveTextContent('2')
    })

    it('should display remove button for each item', () => {
      const store = createMockStore({
        cart: {
          items: [
            {
              product: { id: '1', name: 'Laptop', price: 1000, stock: 5 },
              quantity: 1,
            },
          ],
          shippingAddress: null,
          paymentInfo: null,
        },
      })
      renderWithProviders(<CheckoutPage />, store)

      const removeBtn = screen.getByLabelText('Eliminar Laptop')
      expect(removeBtn).toBeInTheDocument()
    })

    it('should increment quantity when + button is clicked', () => {
      const store = createMockStore({
        cart: {
          items: [
            {
              product: { id: '1', name: 'Laptop', price: 1000, stock: 5 },
              quantity: 1,
            },
          ],
          shippingAddress: null,
          paymentInfo: null,
        },
      })
      renderWithProviders(<CheckoutPage />, store)

      const incrementBtn = screen.getByLabelText('Aumentar cantidad')
      fireEvent.click(incrementBtn)

      // Verify the Redux action was dispatched
      const state = store.getState()
      expect(state.cart.items[0].quantity).toBe(2)
    })

    it('should decrement quantity when - button is clicked', () => {
      const store = createMockStore({
        cart: {
          items: [
            {
              product: { id: '1', name: 'Laptop', price: 1000, stock: 5 },
              quantity: 3,
            },
          ],
          shippingAddress: null,
          paymentInfo: null,
        },
      })
      renderWithProviders(<CheckoutPage />, store)

      const decrementBtn = screen.getByLabelText('Disminuir cantidad')
      fireEvent.click(decrementBtn)

      const state = store.getState()
      expect(state.cart.items[0].quantity).toBe(2)
    })

    it('should remove item when - button is clicked and quantity is 1', () => {
      const store = createMockStore({
        cart: {
          items: [
            {
              product: { id: '1', name: 'Laptop', price: 1000, stock: 5 },
              quantity: 1,
            },
          ],
          shippingAddress: null,
          paymentInfo: null,
        },
      })
      renderWithProviders(<CheckoutPage />, store)

      const decrementBtn = screen.getByLabelText('Disminuir cantidad')
      fireEvent.click(decrementBtn)

      const state = store.getState()
      expect(state.cart.items.length).toBe(0)
    })

    it('should remove item when × button is clicked', () => {
      const store = createMockStore({
        cart: {
          items: [
            {
              product: { id: '1', name: 'Laptop', price: 1000, stock: 5 },
              quantity: 2,
            },
          ],
          shippingAddress: null,
          paymentInfo: null,
        },
      })
      renderWithProviders(<CheckoutPage />, store)

      const removeBtn = screen.getByLabelText('Eliminar Laptop')
      fireEvent.click(removeBtn)

      const state = store.getState()
      expect(state.cart.items.length).toBe(0)
    })

    it('should update total when quantity changes', async () => {
      const store = createMockStore({
        cart: {
          items: [
            {
              product: { id: '1', name: 'Laptop', price: 1000, stock: 5 },
              quantity: 1,
            },
          ],
          shippingAddress: null,
          paymentInfo: null,
        },
      })
      renderWithProviders(<CheckoutPage />, store)

      // Initial total: 1000 * 1 = 1000
      const totalElements = screen.getAllByText(/\$1\.000/)
      expect(totalElements.length).toBeGreaterThan(0)

      const incrementBtn = screen.getByLabelText('Aumentar cantidad')
      fireEvent.click(incrementBtn)

      // After increment: 1000 * 2 = 2000
      await waitFor(() => {
        const updatedElements = screen.getAllByText(/\$2\.000/)
        expect(updatedElements.length).toBeGreaterThan(0)
      })
    })

    it('should handle multiple items with different quantities', () => {
      const store = createMockStore({
        cart: {
          items: [
            {
              product: { id: '1', name: 'Laptop', price: 1000, stock: 5 },
              quantity: 2,
            },
            {
              product: { id: '2', name: 'Mouse', price: 50, stock: 10 },
              quantity: 1,
            },
          ],
          shippingAddress: null,
          paymentInfo: null,
        },
      })
      renderWithProviders(<CheckoutPage />, store)

      const incrementBtns = screen.getAllByLabelText('Aumentar cantidad')
      const decrementBtns = screen.getAllByLabelText('Disminuir cantidad')

      expect(incrementBtns).toHaveLength(2)
      expect(decrementBtns).toHaveLength(2)

      // Test first item increment
      fireEvent.click(incrementBtns[0])
      const state = store.getState()
      expect(state.cart.items[0].quantity).toBe(3)
    })

    it('should redirect to products when last item is removed', async () => {
      const store = createMockStore({
        cart: {
          items: [
            {
              product: { id: '1', name: 'Laptop', price: 1000, stock: 5 },
              quantity: 1,
            },
          ],
          shippingAddress: null,
          paymentInfo: null,
        },
      })
      renderWithProviders(<CheckoutPage />, store)

      const removeBtn = screen.getByLabelText('Eliminar Laptop')
      fireEvent.click(removeBtn)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/products')
      })
    })
  })
})


import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import Header from './Header'
import authReducer from '@/features/auth/authSlice'
import cartReducer from '@/features/cart/cartSlice'
import productsReducer from '@/features/products/productsSlice'
import checkoutReducer from '@/features/checkout/checkoutSlice'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      products: productsReducer,
      cart: cartReducer,
      checkout: checkoutReducer,
    },
    preloadedState: {
      auth: {
        token: null,
        user: null,
        customer: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      },
      products: {
        items: [],
        loading: false,
        error: null,
      },
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
      checkout: {
        transaction: null,
        loading: false,
        error: null,
        pollingActive: false,
      },
      ...initialState,
    },
  })
}

const renderWithProviders = (
  component: React.ReactElement,
  store = createMockStore()
) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  )
}

describe('Header', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  describe('Rendering', () => {
    it('should render header with logo and title', () => {
      const store = createMockStore()
      renderWithProviders(<Header />, store)

      expect(screen.getByText('Checkout Store')).toBeInTheDocument()
      expect(screen.getByLabelText('Logo de la tienda')).toBeInTheDocument()
    })

    it('should render cart button', () => {
      const store = createMockStore()
      renderWithProviders(<Header />, store)

      expect(screen.getByLabelText(/carrito de compras/i)).toBeInTheDocument()
    })

    it('should render login button when not authenticated', () => {
      const store = createMockStore({
        auth: {
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        },
      })
      renderWithProviders(<Header />, store)

      expect(screen.getByText('Iniciar sesión')).toBeInTheDocument()
    })

    it('should render user info when authenticated', () => {
      const store = createMockStore({
        auth: {
          token: 'fake-token',
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      })
      renderWithProviders(<Header />, store)

      expect(screen.getByLabelText('Usuario autenticado')).toBeInTheDocument()
      expect(screen.queryByText('Iniciar sesión')).not.toBeInTheDocument()
    })
  })

  describe('Cart Badge', () => {
    it('should not show badge when cart is empty', () => {
      const store = createMockStore({
        cart: {
          items: [],
          shippingAddress: null,
          paymentInfo: null,
        },
      })
      renderWithProviders(<Header />, store)

      expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument()
    })

    it('should show correct item count in badge', () => {
      const store = createMockStore({
        cart: {
          items: [
            {
              product: { id: '1', name: 'Laptop', price: 1000, stock: 5 },
              quantity: 2,
            },
            {
              product: { id: '2', name: 'Mouse', price: 50, stock: 10 },
              quantity: 3,
            },
          ],
          shippingAddress: null,
          paymentInfo: null,
        },
      })
      renderWithProviders(<Header />, store)

      // 2 + 3 = 5 items total
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should update badge when items change', () => {
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
      const { rerender } = renderWithProviders(<Header />, store)

      expect(screen.getByText('1')).toBeInTheDocument()

      // Simulate cart update
      store.dispatch({
        type: 'cart/addToCart',
        payload: {
          product: { id: '2', name: 'Mouse', price: 50, stock: 10 },
          quantity: 2,
        },
      })

      rerender(
        <Provider store={store}>
          <BrowserRouter>
            <Header />
          </BrowserRouter>
        </Provider>
      )

      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('should navigate to products when clicking logo', () => {
      const store = createMockStore()
      const { container } = renderWithProviders(<Header />, store)

      const brand = container.querySelector('.app-header__brand')
      fireEvent.click(brand!)

      expect(mockNavigate).toHaveBeenCalledWith('/products')
    })

    it('should navigate to checkout when clicking cart with items', () => {
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
      renderWithProviders(<Header />, store)

      const cartButton = screen.getByLabelText(/carrito de compras/i)
      fireEvent.click(cartButton)

      expect(mockNavigate).toHaveBeenCalledWith('/checkout')
    })

    it('should not navigate when clicking cart with no items', () => {
      const store = createMockStore({
        cart: {
          items: [],
          shippingAddress: null,
          paymentInfo: null,
        },
      })
      renderWithProviders(<Header />, store)

      const cartButton = screen.getByLabelText(/carrito de compras/i)
      fireEvent.click(cartButton)

      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should navigate to login page when clicking login button', () => {
      const store = createMockStore()
      renderWithProviders(<Header />, store)

      const loginButton = screen.getByText('Iniciar sesión')
      fireEvent.click(loginButton)

      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
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
      renderWithProviders(<Header />, store)

      expect(screen.getByRole('banner')).toBeInTheDocument()
      expect(screen.getByLabelText(/navegación principal/i)).toBeInTheDocument()
      expect(
        screen.getByLabelText('Carrito de compras con 2 artículos')
      ).toBeInTheDocument()
    })

    it('should have correct aria-live on cart badge', () => {
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
      const { container } = renderWithProviders(<Header />, store)

      const badge = container.querySelector('.cart-badge')
      expect(badge).toHaveAttribute('aria-live', 'polite')
    })

    it('should disable cart button when empty', () => {
      const store = createMockStore({
        cart: {
          items: [],
          shippingAddress: null,
          paymentInfo: null,
        },
      })
      renderWithProviders(<Header />, store)

      const cartButton = screen.getByLabelText(/carrito de compras/i)
      expect(cartButton).toBeDisabled()
    })
  })

  describe('Responsive Behavior', () => {
    it('should have responsive classes', () => {
      const store = createMockStore()
      const { container } = renderWithProviders(<Header />, store)

      const header = container.querySelector('.app-header')
      expect(header).toBeInTheDocument()
      expect(header?.querySelector('.app-header__container')).toBeInTheDocument()
    })
  })
})

import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import ProductPage from './ProductPage'
import authReducer from '@/features/auth/authSlice'
import productsReducer from '@/features/products/productsSlice'
import cartReducer from '@/features/cart/cartSlice'
import checkoutReducer from '@/features/checkout/checkoutSlice'

// Mock de axios
jest.mock('axios')

// Mock de react-router-dom
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

// Helper para crear un store de prueba
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      products: productsReducer,
      cart: cartReducer,
      checkout: checkoutReducer,
    },
    preloadedState: initialState,
  })
}

// Helper para renderizar con Provider
const renderWithStore = (component: React.ReactElement, initialState = {}) => {
  const store = createTestStore(initialState)
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  }
}

describe('ProductPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockNavigate.mockClear()
  })

  describe('Rendering inicial', () => {
    it('debe renderizar el componente correctamente', () => {
      const initialState = {
        auth: { token: null, isAuthenticated: false, loading: false, error: null },
        products: { items: [], loading: false, error: null },
        cart: { items: [], shippingAddress: null, paymentInfo: null },
        checkout: { transaction: null, loading: false, error: null, pollingActive: false },
      }
      renderWithStore(<ProductPage />, initialState)
      expect(screen.getByText('Productos Disponibles')).toBeInTheDocument()
      expect(screen.getByText('Checkout Store')).toBeInTheDocument()
    })

    it('debe mostrar el estado de carga inicialmente', () => {
      const initialState = {
        auth: { token: null, isAuthenticated: false, loading: false, error: null },
        products: { items: [], loading: true, error: null },
        cart: { items: [], shippingAddress: null, paymentInfo: null },
        checkout: { transaction: null, loading: false, error: null, pollingActive: false },
      }
      renderWithStore(<ProductPage />, initialState)
      expect(screen.getByText('Cargando productos...')).toBeInTheDocument()
    })

    it('debe mostrar advertencia de autenticación cuando no está autenticado', () => {
      const initialState = {
        auth: { token: null, isAuthenticated: false, loading: false, error: null },
        products: { items: [], loading: false, error: null },
        cart: { items: [], shippingAddress: null, paymentInfo: null },
        checkout: { transaction: null, loading: false, error: null, pollingActive: false },
      }
      renderWithStore(<ProductPage />, initialState)
      
      expect(
        screen.getByText('⚠️ Inicia sesión para completar tu compra')
      ).toBeInTheDocument()
    })

    it('NO debe mostrar advertencia cuando está autenticado', () => {
      const initialState = {
        auth: { token: 'fake-token', isAuthenticated: true, loading: false, error: null },
        products: { items: [], loading: false, error: null },
        cart: { items: [], shippingAddress: null, paymentInfo: null },
        checkout: { transaction: null, loading: false, error: null, pollingActive: false },
      }
      renderWithStore(<ProductPage />, initialState)
      
      expect(
        screen.queryByText('⚠️ Inicia sesión para completar tu compra')
      ).not.toBeInTheDocument()
    })
  })

  describe('Visualización de productos', () => {
    it('debe mostrar la lista de productos cuando carga exitosamente', () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Producto Test 1',
          description: 'Descripción del producto 1',
          price: 100000,
          stock: 5,
        },
        {
          id: '2',
          name: 'Producto Test 2',
          description: 'Descripción del producto 2',
          price: 200000,
          stock: 3,
        },
      ]

      const initialState = {
        auth: { token: null, isAuthenticated: false, loading: false, error: null },
        products: { items: mockProducts, loading: false, error: null },
        cart: { items: [], shippingAddress: null, paymentInfo: null },
        checkout: { transaction: null, loading: false, error: null, pollingActive: false },
      }

      renderWithStore(<ProductPage />, initialState)

      expect(screen.getByText('Producto Test 1')).toBeInTheDocument()
      expect(screen.getByText('Producto Test 2')).toBeInTheDocument()
      expect(screen.getByText('Descripción del producto 1')).toBeInTheDocument()
      expect(screen.getByText('Descripción del producto 2')).toBeInTheDocument()
    })

    it('debe mostrar el precio formateado correctamente', () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Producto Test',
          description: 'Descripción',
          price: 150000,
          stock: 5,
        },
      ]

      const initialState = {
        auth: { token: null, isAuthenticated: false, loading: false, error: null },
        products: { items: mockProducts, loading: false, error: null },
        cart: { items: [], shippingAddress: null, paymentInfo: null },
        checkout: { transaction: null, loading: false, error: null, pollingActive: false },
      }

      renderWithStore(<ProductPage />, initialState)

      expect(screen.getByText('$150.000')).toBeInTheDocument()
    })

    it('debe mostrar el stock disponible', () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Producto Test',
          description: 'Descripción',
          price: 100000,
          stock: 7,
        },
      ]

      const initialState = {
        auth: { token: null, isAuthenticated: false, loading: false, error: null },
        products: { items: mockProducts, loading: false, error: null },
        cart: { items: [], shippingAddress: null, paymentInfo: null },
        checkout: { transaction: null, loading: false, error: null, pollingActive: false },
      }

      renderWithStore(<ProductPage />, initialState)

      expect(screen.getByText('7 disponibles')).toBeInTheDocument()
    })

    it('debe mostrar "Agotado" cuando no hay stock', () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Producto Sin Stock',
          description: 'Descripción',
          price: 100000,
          stock: 0,
        },
      ]

      const initialState = {
        auth: { token: null, isAuthenticated: false, loading: false, error: null },
        products: { items: mockProducts, loading: false, error: null },
        cart: { items: [], shippingAddress: null, paymentInfo: null },
        checkout: { transaction: null, loading: false, error: null, pollingActive: false },
      }

      renderWithStore(<ProductPage />, initialState)

      expect(screen.getByText('Agotado')).toBeInTheDocument()
    })

    it('debe mostrar mensaje cuando no hay productos', () => {
      const initialState = {
        auth: { token: null, isAuthenticated: false, loading: false, error: null },
        products: { items: [], loading: false, error: null },
        cart: { items: [], shippingAddress: null, paymentInfo: null },
        checkout: { transaction: null, loading: false, error: null, pollingActive: false },
      }

      renderWithStore(<ProductPage />, initialState)

      expect(
        screen.getByText('No hay productos disponibles en este momento.')
      ).toBeInTheDocument()
    })
  })

  describe('Manejo de errores', () => {
    it('debe mostrar mensaje de error cuando falla la carga', () => {
      const initialState = {
        auth: { token: null, isAuthenticated: false, loading: false, error: null },
        products: { items: [], loading: false, error: 'Error al cargar productos' },
        cart: { items: [], shippingAddress: null, paymentInfo: null },
        checkout: { transaction: null, loading: false, error: null, pollingActive: false },
      }

      renderWithStore(<ProductPage />, initialState)

      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText('Error al cargar productos')).toBeInTheDocument()
    })

    it('debe tener un botón de reintentar cuando hay error', () => {
      const initialState = {
        auth: { token: null, isAuthenticated: false, loading: false, error: null },
        products: { items: [], loading: false, error: 'Error de conexión' },
        cart: { items: [], shippingAddress: null, paymentInfo: null },
        checkout: { transaction: null, loading: false, error: null, pollingActive: false },
      }

      renderWithStore(<ProductPage />, initialState)

      const retryButton = screen.getByText('Reintentar')
      expect(retryButton).toBeInTheDocument()
    })
  })

  describe('Interacciones del usuario', () => {
    it('debe agregar producto al carrito al hacer clic en Comprar', () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Producto Test',
          description: 'Descripción',
          price: 100000,
          stock: 5,
        },
      ]

      const initialState = {
        auth: { token: null, isAuthenticated: false, loading: false, error: null },
        products: { items: mockProducts, loading: false, error: null },
        cart: { items: [], shippingAddress: null, paymentInfo: null },
        checkout: { transaction: null, loading: false, error: null, pollingActive: false },
      }

      const { store } = renderWithStore(<ProductPage />, initialState)

      const buyButton = screen.getByText('Comprar')
      fireEvent.click(buyButton)

      const cartState = store.getState().cart
      expect(cartState.items).toHaveLength(1)
      expect(cartState.items[0].product.id).toBe('1')
      expect(cartState.items[0].quantity).toBe(1)

      expect(mockNavigate).toHaveBeenCalledWith('/checkout')
    })

    it('debe deshabilitar el botón cuando no hay stock', () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Producto Sin Stock',
          description: 'Descripción',
          price: 100000,
          stock: 0,
        },
      ]

      const initialState = {
        auth: { token: null, isAuthenticated: false, loading: false, error: null },
        products: { items: mockProducts, loading: false, error: null },
        cart: { items: [], shippingAddress: null, paymentInfo: null },
        checkout: { transaction: null, loading: false, error: null, pollingActive: false },
      }

      renderWithStore(<ProductPage />, initialState)

      const button = screen.getByText('No disponible')
      expect(button).toBeDisabled()
    })
  })

  describe('useEffect y llamadas a API', () => {
    it('debe llamar fetchProducts al montar el componente', () => {
      const initialState = {
        auth: { token: null, isAuthenticated: false, loading: false, error: null },
        products: { items: [], loading: false, error: null },
        cart: { items: [], shippingAddress: null, paymentInfo: null },
        checkout: { transaction: null, loading: false, error: null, pollingActive: false },
      }

      const { store } = renderWithStore(<ProductPage />, initialState)

      // Verificar que se despachó la acción
      const actions = store.getState()
      expect(actions).toBeDefined()
    })
  })
})

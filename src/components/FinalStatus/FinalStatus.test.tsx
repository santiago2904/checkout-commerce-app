import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { FinalStatus } from './FinalStatus'
import cartReducer from '@/features/cart/cartSlice'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: initialState,
  })
}

const renderWithRouter = (component: React.ReactElement, store: any) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  )
}

describe('FinalStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render success status when transaction is approved', () => {
    const store = createMockStore({
      cart: {
        items: [],
        shippingAddress: null,
        paymentInfo: null,
        customerEmail: null,
        acceptanceToken: null,
        acceptancePermalink: null,
        transactionId: 'test-id',
        wompiTransactionId: '15113-1772324995-34224',
        transactionStatus: 'APPROVED',
        checkoutLoading: false,
        checkoutError: null,
        isPolling: false,
      },
    })

    renderWithRouter(<FinalStatus />, store)

    expect(screen.getByText('¡Pago Exitoso!')).toBeInTheDocument()
    expect(
      screen.getByText('Tu transacción ha sido aprobada correctamente.')
    ).toBeInTheDocument()
    expect(screen.getByText(/15113-1772324995-34224/i)).toBeInTheDocument()
  })

  it('should render declined status when transaction is declined', () => {
    const store = createMockStore({
      cart: {
        items: [],
        shippingAddress: null,
        paymentInfo: null,
        customerEmail: null,
        acceptanceToken: null,
        acceptancePermalink: null,
        transactionId: 'test-id',
        wompiTransactionId: '15113-1772324995-34224',
        transactionStatus: 'DECLINED',
        checkoutLoading: false,
        checkoutError: 'Insufficient funds',
        isPolling: false,
      },
    })

    renderWithRouter(<FinalStatus />, store)

    expect(screen.getByText('Pago Rechazado')).toBeInTheDocument()
    expect(
      screen.getByText('Lo sentimos, tu transacción no pudo ser procesada.')
    ).toBeInTheDocument()
    expect(screen.getByText('Insufficient funds')).toBeInTheDocument()
  })

  it('should render pending status when transaction is pending', () => {
    const store = createMockStore({
      cart: {
        items: [],
        shippingAddress: null,
        paymentInfo: null,
        customerEmail: null,
        acceptanceToken: null,
        acceptancePermalink: null,
        transactionId: 'test-id',
        wompiTransactionId: '15113-1772324995-34224',
        transactionStatus: 'PENDING',
        checkoutLoading: false,
        checkoutError: null,
        isPolling: true,
      },
    })

    renderWithRouter(<FinalStatus />, store)

    expect(screen.getByText('Procesando Pago')).toBeInTheDocument()
    expect(
      screen.getByText('Tu transacción está siendo procesada...')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /volver a productos/i })).toBeInTheDocument()
  })

  it('should navigate to products when return button clicked', () => {
    const store = createMockStore({
      cart: {
        items: [],
        shippingAddress: null,
        paymentInfo: null,
        customerEmail: null,
        acceptanceToken: null,
        acceptancePermalink: null,
        transactionId: 'test-id',
        wompiTransactionId: '15113-1772324995-34224',
        transactionStatus: 'APPROVED',
        checkoutLoading: false,
        checkoutError: null,
        isPolling: false,
      },
    })

    renderWithRouter(<FinalStatus />, store)

    const returnButton = screen.getByRole('button', { name: /volver a productos/i })
    fireEvent.click(returnButton)

    expect(mockNavigate).toHaveBeenCalledWith('/products')
  })

  it('should clear cart when return button clicked', () => {
    const store = createMockStore({
      cart: {
        items: [
          {
            product: {
              id: '1',
              name: 'Test Product',
              price: 10000,
              stock: 10,
            },
            quantity: 1,
          },
        ],
        shippingAddress: null,
        paymentInfo: null,
        customerEmail: null,
        acceptanceToken: null,
        acceptancePermalink: null,
        transactionId: 'test-id',
        wompiTransactionId: '15113-1772324995-34224',
        transactionStatus: 'APPROVED',
        checkoutLoading: false,
        checkoutError: null,
        isPolling: false,
      },
    })

    renderWithRouter(<FinalStatus />, store)

    const returnButton = screen.getByRole('button', { name: /volver a productos/i })
    fireEvent.click(returnButton)

    const state = store.getState()
    expect(state.cart.items).toHaveLength(0)
  })

  it('should display success icon for approved transaction', () => {
    const store = createMockStore({
      cart: {
        items: [],
        shippingAddress: null,
        paymentInfo: null,
        customerEmail: null,
        acceptanceToken: null,
        acceptancePermalink: null,
        transactionId: 'test-id',
        wompiTransactionId: '15113-1772324995-34224',
        transactionStatus: 'APPROVED',
        checkoutLoading: false,
        checkoutError: null,
        isPolling: false,
      },
    })

    const { container } = renderWithRouter(<FinalStatus />, store)

    const successIcon = container.querySelector('.status-icon.success')
    expect(successIcon).toBeInTheDocument()
  })

  it('should display error icon for declined transaction', () => {
    const store = createMockStore({
      cart: {
        items: [],
        shippingAddress: null,
        paymentInfo: null,
        customerEmail: null,
        acceptanceToken: null,
        acceptancePermalink: null,
        transactionId: 'test-id',
        wompiTransactionId: '15113-1772324995-34224',
        transactionStatus: 'DECLINED',
        checkoutLoading: false,
        checkoutError: null,
        isPolling: false,
      },
    })

    const { container } = renderWithRouter(<FinalStatus />, store)

    const errorIcon = container.querySelector('.status-icon.error')
    expect(errorIcon).toBeInTheDocument()
  })

  it('should display loader for pending transaction', () => {
    const store = createMockStore({
      cart: {
        items: [],
        shippingAddress: null,
        paymentInfo: null,
        customerEmail: null,
        acceptanceToken: null,
        acceptancePermalink: null,
        transactionId: 'test-id',
        wompiTransactionId: '15113-1772324995-34224',
        transactionStatus: 'PENDING',
        checkoutLoading: false,
        checkoutError: null,
        isPolling: true,
      },
    })

    const { container } = renderWithRouter(<FinalStatus />, store)

    const loader = container.querySelector('.loader')
    expect(loader).toBeInTheDocument()
  })
})

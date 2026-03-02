import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { BrowserRouter } from 'react-router-dom'
import { PaymentSummaryBackdrop } from './PaymentSummaryBackdrop'
import cartReducer from '@/features/cart/cartSlice'

// Mock fetch
global.fetch = jest.fn()

// Mock useNavigate
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

describe('PaymentSummaryBackdrop', () => {
  const mockOnClose = jest.fn()

  const renderWithRouter = (component: React.ReactElement, store: any) => {
    return render(
      <BrowserRouter>
        <Provider store={store}>
          {component}
        </Provider>
      </BrowserRouter>
    )
  }

  const mockCartState = {
    cart: {
      items: [
        {
          product: {
            id: '1',
            name: 'Test Product',
            price: 11900,
            stock: 10,
          },
          quantity: 2,
        },
      ],
      shippingAddress: {
        addressLine1: 'Calle 123',
        city: 'Bogotá',
        region: 'Cundinamarca',
        country: 'Colombia',
        recipientName: 'Juan Pérez',
        recipientPhone: '+573001234567',
      },
      paymentInfo: {
        number: '4242424242424242',
        holderName: 'Juan Pérez',
        expiryDate: '12/25',
        cvv: '123',
      },
      customerEmail: 'test@test.com',
      acceptanceToken: null,
      acceptancePermalink: null,
      transactionId: null,
      wompiTransactionId: null,
      statusToken: null,
      transactionStatus: null,
      checkoutLoading: false,
      checkoutError: null,
      isPolling: false,
      transactions: [],
      transactionsLoading: false,
      transactionsError: null,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          presigned_acceptance: {
            acceptance_token: 'test-token',
            permalink: 'https://example.com/terms',
            type: 'END_USER_POLICY',
          },
        },
      }),
    })
  })

  it('should render modal with order summary', () => {
    const store = createMockStore(mockCartState)
    renderWithRouter(
      <PaymentSummaryBackdrop
        onClose={mockOnClose}
      />,
      store
    )

    expect(screen.getByText('Resumen del Pedido')).toBeInTheDocument()
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('x2')).toBeInTheDocument()
  })

  it('should display price breakdown with IVA', () => {
    const store = createMockStore(mockCartState)
    renderWithRouter(
      <PaymentSummaryBackdrop
        onClose={mockOnClose}
      />,
      store
    )

    expect(screen.getByText(/Subtotal \(sin IVA\):/i)).toBeInTheDocument()
    expect(screen.getByText(/IVA \(19%\):/i)).toBeInTheDocument()
    expect(screen.getByText(/Envío:/i)).toBeInTheDocument()
    expect(screen.getByText('Gratis')).toBeInTheDocument()
  })

  it('should display shipping address', () => {
    const store = createMockStore(mockCartState)
    renderWithRouter(
      <PaymentSummaryBackdrop
        onClose={mockOnClose}
      />,
      store
    )

    expect(screen.getByText('Dirección de Envío')).toBeInTheDocument()
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
    expect(screen.getByText('Calle 123')).toBeInTheDocument()
    expect(screen.getByText(/Bogotá, Cundinamarca/i)).toBeInTheDocument()
  })

  it('should render terms checkbox', () => {
    const store = createMockStore(mockCartState)
    renderWithRouter(
      <PaymentSummaryBackdrop
        onClose={mockOnClose}
      />,
      store
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
  })

  it('should disable confirm button when terms not accepted', async () => {
    const storeWithToken = createMockStore({
      cart: {
        ...mockCartState.cart,
        acceptanceToken: 'test-token',
        acceptancePermalink: 'https://example.com/terms',
      },
    })
    
    renderWithRouter(
      <PaymentSummaryBackdrop
        onClose={mockOnClose}
      />,
      storeWithToken
    )

    // Wait for component to finish loading
    await waitFor(() => {
      const confirmButton = screen.getByText('Confirmar Pago')
      expect(confirmButton).toBeDisabled()
    })
  })

  it('should enable confirm button when terms accepted and token loaded', async () => {
    const storeWithToken = createMockStore({
      cart: {
        ...mockCartState.cart,
        acceptanceToken: 'test-token',
        acceptancePermalink: 'https://example.com/terms',
      },
    })

    renderWithRouter(
      <PaymentSummaryBackdrop
        onClose={mockOnClose}
      />,
      storeWithToken
    )

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    await waitFor(() => {
      const confirmButton = screen.getByText('Confirmar Pago')
      expect(confirmButton).not.toBeDisabled()
    })
  })

  it('should call onClose when close button clicked', async () => {
    const storeWithToken = createMockStore({
      cart: {
        ...mockCartState.cart,
        acceptanceToken: 'test-token',
        acceptancePermalink: 'https://example.com/terms',
      },
    })
    
    renderWithRouter(
      <PaymentSummaryBackdrop
        onClose={mockOnClose}
      />,
      storeWithToken
    )

    // Wait for component to finish loading
    await waitFor(() => {
      const closeButton = screen.getByLabelText('Cerrar')
      expect(closeButton).not.toBeDisabled()
    })

    const closeButton = screen.getByLabelText('Cerrar')
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when backdrop clicked', () => {
    const store = createMockStore(mockCartState)
    const { container } = renderWithRouter(
      <PaymentSummaryBackdrop
        onClose={mockOnClose}
      />,
      store
    )

    const backdrop = container.querySelector('.payment-summary-backdrop')
    if (backdrop) {
      fireEvent.click(backdrop)
    }

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should fetch acceptance token on mount', async () => {
    const store = createMockStore(mockCartState)
    renderWithRouter(
      <PaymentSummaryBackdrop
        onClose={mockOnClose}
      />,
      store
    )

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })
  })

  it('should display terms link when permalink loaded', async () => {
    const storeWithToken = createMockStore({
      cart: {
        ...mockCartState.cart,
        acceptanceToken: 'test-token',
        acceptancePermalink: 'https://example.com/terms',
      },
    })

    renderWithRouter(
      <PaymentSummaryBackdrop
        onClose={mockOnClose}
      />,
      storeWithToken
    )

    const termsLink = screen.getByText('Términos y Condiciones')
    expect(termsLink).toHaveAttribute('href', 'https://example.com/terms')
    expect(termsLink).toHaveAttribute('target', '_blank')
  })
})

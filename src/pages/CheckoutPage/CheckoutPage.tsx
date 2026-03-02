import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import {
  removeFromCart,
  updateQuantity,
  checkTransactionStatus,
  setPolling,
} from '@/features/cart/cartSlice'
import DeliveryForm from '@/components/DeliveryForm/DeliveryForm'
import CreditCardModal from '@/components/CreditCardModal/CreditCardModal'
import { PaymentSummaryBackdrop } from '@/components/PaymentSummaryBackdrop/PaymentSummaryBackdrop'
import { FinalStatus } from '@/components/FinalStatus/FinalStatus'
import Header from '@/components/Header/Header'
import './CheckoutPage.scss'

type CheckoutStep = 'delivery' | 'payment' | 'summary' | 'status'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {
    items,
    shippingAddress,
    paymentInfo,
    wompiTransactionId,
    transactionStatus,
    isPolling,
  } = useAppSelector((state) => state.cart)

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('delivery')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showSummaryBackdrop, setShowSummaryBackdrop] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (items.length === 0) {
      navigate('/products')
    }
  }, [items, navigate])

  // Si ya existe dirección de envío, mostrar modal de pago automáticamente
  useEffect(() => {
    if (shippingAddress && !paymentInfo && currentStep === 'delivery') {
      setShowPaymentModal(true)
      setCurrentStep('payment')
    }
  }, [shippingAddress, paymentInfo, currentStep])

  // Polling for transaction status
  useEffect(() => {
    if (isPolling && wompiTransactionId) {
      // Start polling every 5 seconds
      pollingIntervalRef.current = setInterval(() => {
        dispatch(checkTransactionStatus(wompiTransactionId))
      }, 5000)

      // Initial check
      dispatch(checkTransactionStatus(wompiTransactionId))
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [isPolling, wompiTransactionId, dispatch])

  // Stop polling when status is final
  useEffect(() => {
    if (transactionStatus === 'APPROVED' || transactionStatus === 'DECLINED') {
      dispatch(setPolling(false))
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [transactionStatus, dispatch])

  // Calcular total del carrito
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)
  }

  const handleDeliveryComplete = () => {
    setCurrentStep('payment')
    setShowPaymentModal(true)
  }

  const handlePaymentComplete = () => {
    setShowPaymentModal(false)
    setCurrentStep('summary')
    setShowSummaryBackdrop(true)
  }

  const handleSummaryClose = () => {
    setShowSummaryBackdrop(false)
    setCurrentStep('payment')
    setShowPaymentModal(true)
  }

  const handlePaymentClose = () => {
    setShowPaymentModal(false)
    setCurrentStep('delivery')
  }

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId))
  }

  const handleIncrement = (productId: string, currentQuantity: number, stock: number) => {
    if (currentQuantity < stock) {
      dispatch(updateQuantity({ productId, quantity: currentQuantity + 1 }))
    }
  }

  const handleDecrement = (productId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      dispatch(updateQuantity({ productId, quantity: currentQuantity - 1 }))
    } else {
      dispatch(removeFromCart(productId))
    }
  }

  const getStockMessage = (stock: number, currentQuantity: number) => {
    if (stock === 0) {
      return { text: 'Sin stock disponible', className: 'stock-warning' }
    }
    if (stock === 1) {
      return { text: 'Solo queda 1 unidad', className: 'stock-warning' }
    }
    if (currentQuantity >= stock) {
      return { text: `Máximo disponible: ${stock} unidades`, className: 'stock-warning' }
    }
    if (stock <= 5) {
      return { text: `Quedan ${stock} disponibles`, className: 'stock-low' }
    }
    return null
  }

  if (items.length === 0) {
    return null
  }

  const total = calculateTotal()

  return (
    <>
      <Header />
      <div className="checkout-page">
        <header className="checkout-page__header">
          <h1>Checkout</h1>
          <button
            className="back-button"
            onClick={() => navigate('/products')}
            aria-label="Volver a productos"
        >
          ← Volver a productos
        </button>
      </header>

      {/* Step Indicators */}
      <div className="checkout-steps">
        <div
          className={`step ${
            currentStep === 'delivery'
              ? 'active'
              : shippingAddress
              ? 'completed'
              : ''
          }`}
        >
          <div className="step__number">1</div>
          <div className="step__label">Envío</div>
        </div>
        <div className="step__divider" />
        <div
          className={`step ${
            currentStep === 'payment'
              ? 'active'
              : paymentInfo
              ? 'completed'
              : ''
          }`}
        >
          <div className="step__number">2</div>
          <div className="step__label">Pago</div>
        </div>
        <div className="step__divider" />
        <div className={`step ${currentStep === 'summary' ? 'active' : ''}`}>
          <div className="step__number">3</div>
          <div className="step__label">Resumen</div>
        </div>
      </div>

      <main className="checkout-page__content" role="main">
        {currentStep === 'status' ? (
          <FinalStatus />
        ) : (
          <>
            <div className="checkout-page__main">
              {currentStep === 'delivery' && !showPaymentModal && (
                <DeliveryForm onSubmit={handleDeliveryComplete} />
              )}

              {currentStep === 'payment' && showPaymentModal && (
                <CreditCardModal
                  isOpen={showPaymentModal}
                  onClose={handlePaymentClose}
                  onSubmit={handlePaymentComplete}
                />
              )}
            </div>

            {/* Cart Summary Sidebar */}
            <aside className="checkout-page__sidebar">
              <div className="cart-summary">
                <h2 className="cart-summary__title">Resumen del Pedido</h2>

                <div className="cart-summary__items">
                  {items.map((item, index) => (
                    <div key={`${item.product.id}-${index}`} className="cart-item">
                      {item.product.imageUrl && (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="cart-item__image"
                        />
                      )}
                      <div className="cart-item__details">
                        <div className="cart-item__header">
                          <h3 className="cart-item__name">{item.product.name}</h3>
                          <button
                            className="cart-item__remove"
                            onClick={() => handleRemoveItem(item.product.id)}
                            aria-label={`Eliminar ${item.product.name}`}
                            title="Eliminar del carrito"
                          >
                            ×
                          </button>
                        </div>
                        <div className="cart-item__quantity-control">
                          <button
                            className="quantity-btn"
                            onClick={() => handleDecrement(item.product.id, item.quantity)}
                            aria-label="Disminuir cantidad"
                          >
                            −
                          </button>
                          <span className="quantity-value">{item.quantity}</span>
                          <button
                            className="quantity-btn"
                            onClick={() => handleIncrement(item.product.id, item.quantity, item.product.stock)}
                            aria-label="Aumentar cantidad"
                            disabled={item.quantity >= item.product.stock}
                          >
                            +
                          </button>
                        </div>
                        {getStockMessage(item.product.stock, item.quantity) && (
                          <p className={`cart-item__stock-message ${getStockMessage(item.product.stock, item.quantity)?.className}`}>
                            {getStockMessage(item.product.stock, item.quantity)?.text}
                          </p>
                        )}
                        <p className="cart-item__price">
                          ${(item.product.price * item.quantity).toLocaleString('es-CO')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary__total">
                  <div className="total-row">
                    <span>Subtotal (sin IVA):</span>
                    <span>${Math.round(total / 1.19).toLocaleString('es-CO')}</span>
                  </div>
                  <div className="total-row">
                    <span>IVA (19%):</span>
                    <span>${Math.round(total - total / 1.19).toLocaleString('es-CO')}</span>
                  </div>
                  <div className="total-row">
                    <span>Envío:</span>
                    <span className="free-shipping">Gratis</span>
                  </div>
                  <div className="total-row total-row--grand">
                    <span>Total:</span>
                    <span>${total.toLocaleString('es-CO')}</span>
                  </div>
                </div>

                {/* Status indicators */}
                <div className="cart-summary__status">
                  <div className={`status-item ${shippingAddress ? 'complete' : ''}`}>
                    {shippingAddress ? '✓' : '○'} Dirección de envío
                  </div>
                  <div className={`status-item ${paymentInfo ? 'complete' : ''}`}>
                    {paymentInfo ? '✓' : '○'} Información de pago
                  </div>
                </div>
              </div>
            </aside>
          </>
        )}
      </main>

      {/* Payment Summary Backdrop */}
      {showSummaryBackdrop && (
        <PaymentSummaryBackdrop
          onClose={handleSummaryClose}
        />
      )}
    </div>
    </>
  )
}

export default CheckoutPage

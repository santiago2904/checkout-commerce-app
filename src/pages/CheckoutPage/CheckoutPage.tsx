import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { removeFromCart, updateQuantity } from '@/features/cart/cartSlice'
import DeliveryForm from '@/components/DeliveryForm/DeliveryForm'
import CreditCardModal from '@/components/CreditCardModal/CreditCardModal'
import Header from '@/components/Header/Header'
import './CheckoutPage.scss'

type CheckoutStep = 'delivery' | 'payment' | 'summary'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items, shippingAddress, paymentInfo } = useAppSelector(
    (state) => state.cart
  )

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('delivery')
  const [showPaymentModal, setShowPaymentModal] = useState(false)

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
    // Navegar a la página de resumen
    navigate('/checkout/summary')
  }

  const handlePaymentClose = () => {
    setShowPaymentModal(false)
    setCurrentStep('delivery')
  }

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId))
  }

  const handleIncrement = (productId: string, currentQuantity: number) => {
    dispatch(updateQuantity({ productId, quantity: currentQuantity + 1 }))
  }

  const handleDecrement = (productId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      dispatch(updateQuantity({ productId, quantity: currentQuantity - 1 }))
    } else {
      dispatch(removeFromCart(productId))
    }
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
                        onClick={() => handleIncrement(item.product.id, item.quantity)}
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                    <p className="cart-item__price">
                      ${(item.product.price * item.quantity).toLocaleString('es-CO')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary__total">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${total.toLocaleString('es-CO')}</span>
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
      </main>
    </div>
    </>
  )
}

export default CheckoutPage

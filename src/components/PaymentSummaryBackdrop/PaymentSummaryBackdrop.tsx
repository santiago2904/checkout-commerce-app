import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '@/store/store'
import { fetchAcceptanceToken, submitCheckout } from '@/features/cart/cartSlice'
import { CartItem } from '@/types'
import './PaymentSummaryBackdrop.scss'

interface PaymentSummaryBackdropProps {
  onClose: () => void
}

export const PaymentSummaryBackdrop = ({
  onClose,
}: PaymentSummaryBackdropProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const {
    items,
    shippingAddress,
    paymentInfo,
    customerEmail,
    acceptanceToken,
    acceptancePermalink,
    checkoutLoading,
    checkoutError,
  } = useSelector((state: RootState) => state.cart)

  const [termsAccepted, setTermsAccepted] = useState(false)

  useEffect(() => {
    // Fetch acceptance token on mount
    if (!acceptanceToken) {
      dispatch(fetchAcceptanceToken())
    }
  }, [dispatch, acceptanceToken])

  const calculateSubtotal = () => {
    return items.reduce((sum: number, item: CartItem) => sum + item.product.price * item.quantity, 0)
  }

  const calculateIVA = () => {
    const total = calculateSubtotal()
    return Math.round(total - total / 1.19)
  }

  const calculateTotal = () => {
    return calculateSubtotal()
  }

  const handleConfirmPayment = async () => {
    if (!acceptanceToken || !shippingAddress || !paymentInfo || !customerEmail) {
      return
    }

    // Parse expiry date (format: MM/YY)
    const [expMonth, expYear] = paymentInfo.expiryDate.split('/')

    const checkoutData = {
      acceptanceToken,
      items: items.map((item: CartItem) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      paymentMethod: {
        type: 'CARD' as const,
        cardData: {
          number: paymentInfo.number.replace(/\s/g, ''), // Eliminar espacios
          cvc: paymentInfo.cvv,
          exp_month: expMonth,
          exp_year: expYear,
          card_holder: paymentInfo.holderName,
        },
        installments: 1,
      },
      shippingAddress,
      customerEmail,
    }

    const result = await dispatch(submitCheckout(checkoutData))
    
    if (submitCheckout.fulfilled.match(result)) {
      // Refetch acceptance token para el próximo uso (token de un solo uso)
      dispatch(fetchAcceptanceToken())
      
      // Redirigir a la página de estado con el statusToken
      const statusToken = result.payload.data.statusToken
      navigate(`/transaction-status?token=${statusToken}`)
    }
  }

  const isConfirmDisabled = !termsAccepted || !acceptanceToken || checkoutLoading

  const subtotal = calculateSubtotal()
  const iva = calculateIVA()
  const total = calculateTotal()

  return (
    <div className="payment-summary-backdrop" onClick={onClose}>
      <div className="payment-summary-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Resumen del Pedido</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Cerrar"
            disabled={checkoutLoading}
          >
            ×
          </button>
        </div>

        <div className="modal-content">
          {/* Order Items */}
          <div className="order-items">
            <h3>Productos</h3>
            {items.map((item: CartItem) => (
              <div key={item.product.id} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.product.name}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
                <span className="item-price">
                  ${(item.product.price * item.quantity).toLocaleString('es-CO')}
                </span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="price-breakdown">
            <div className="price-row">
              <span>Subtotal (sin IVA):</span>
              <span>${Math.round(subtotal / 1.19).toLocaleString('es-CO')}</span>
            </div>
            <div className="price-row">
              <span>IVA (19%):</span>
              <span>${iva.toLocaleString('es-CO')}</span>
            </div>
            <div className="price-row">
              <span>Envío:</span>
              <span className="free-shipping">Gratis</span>
            </div>
            <div className="price-row total">
              <span>Total:</span>
              <span>${total.toLocaleString('es-CO')}</span>
            </div>
          </div>

          {/* Shipping Address Summary */}
          {shippingAddress && (
            <div className="shipping-summary">
              <h3>Dirección de Envío</h3>
              <p>{shippingAddress.recipientName}</p>
              <p>{shippingAddress.addressLine1}</p>
              <p>
                {shippingAddress.city}, {shippingAddress.region}
              </p>
              <p>{shippingAddress.country}</p>
              <p>{shippingAddress.recipientPhone}</p>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="terms-section">
            <label className="terms-checkbox">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                disabled={!acceptanceToken || checkoutLoading}
              />
              <span>
                Acepto los{' '}
                {acceptancePermalink ? (
                  <a
                    href={acceptancePermalink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Términos y Condiciones
                  </a>
                ) : (
                  'Términos y Condiciones'
                )}
              </span>
            </label>
          </div>

          {/* Error Message */}
          {checkoutError && (
            <div className="error-message" role="alert">
              {checkoutError}
            </div>
          )}

          {/* Loading Message */}
          {checkoutLoading && !acceptanceToken && (
            <div className="loading-message">Cargando información de pago...</div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="cancel-button"
            onClick={onClose}
            disabled={checkoutLoading}
          >
            Cancelar
          </button>
          <button
            className="confirm-button"
            onClick={handleConfirmPayment}
            disabled={isConfirmDisabled}
          >
            {checkoutLoading ? 'Procesando...' : 'Confirmar Pago'}
          </button>
        </div>
      </div>
    </div>
  )
}

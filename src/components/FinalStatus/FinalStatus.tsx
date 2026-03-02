import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { clearCart, resetCheckout } from '@/features/cart/cartSlice'
import './FinalStatus.scss'

export const FinalStatus = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { transactionStatus, wompiTransactionId, checkoutError } = useSelector(
    (state: RootState) => state.cart
  )

  const handleReturnToProducts = () => {
    // Clear cart and reset checkout state
    dispatch(clearCart())
    dispatch(resetCheckout())
    // Navigate to products page
    navigate('/products')
  }

  const isApproved = transactionStatus === 'APPROVED'
  const isDeclined = transactionStatus === 'DECLINED'

  return (
    <div className="final-status">
      <div className="status-card">
        {isApproved && (
          <>
            <div className="status-icon success">
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="32" cy="32" r="32" fill="#28a745" />
                <path
                  d="M20 32L28 40L44 24"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1>¡Pago Exitoso!</h1>
            <p className="status-message">
              Tu transacción ha sido aprobada correctamente.
            </p>
            {wompiTransactionId && (
              <p className="transaction-id">
                ID de transacción: <strong>{wompiTransactionId}</strong>
              </p>
            )}
            <p className="info-text">
              Recibirás un correo de confirmación con los detalles de tu pedido.
            </p>
          </>
        )}

        {isDeclined && (
          <>
            <div className="status-icon error">
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="32" cy="32" r="32" fill="#dc3545" />
                <path
                  d="M24 24L40 40M40 24L24 40"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1>Pago Rechazado</h1>
            <p className="status-message">
              Lo sentimos, tu transacción no pudo ser procesada.
            </p>
            {checkoutError && (
              <p className="error-detail">{checkoutError}</p>
            )}
            <p className="info-text">
              Por favor, verifica tu información de pago e intenta nuevamente.
            </p>
          </>
        )}

        {!isApproved && !isDeclined && (
          <>
            <div className="status-icon pending">
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="32" cy="32" r="32" fill="#ffc107" />
                <path
                  d="M32 16V32L40 40"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1>Procesando Pago</h1>
            <p className="status-message">
              Tu transacción está siendo procesada...
            </p>
            <div className="loader"></div>
          </>
        )}

        <button className="return-button" onClick={handleReturnToProducts}>
          Volver a Productos
        </button>
      </div>
    </div>
  )
}

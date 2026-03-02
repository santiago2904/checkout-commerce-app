import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AppDispatch, RootState } from '@/store/store'
import { fetchMyTransactions } from '@/features/cart/cartSlice'
import Header from '@/components/Header/Header'
import './TransactionHistoryPage.scss'

const TransactionHistoryPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { transactions, transactionsLoading, transactionsError } = useSelector(
    (state: RootState) => state.cart
  )
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/products')
      return
    }
    dispatch(fetchMyTransactions())
  }, [dispatch, isAuthenticated, navigate])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'status-badge status-approved'
      case 'PENDING':
        return 'status-badge status-pending'
      case 'DECLINED':
        return 'status-badge status-declined'
      default:
        return 'status-badge'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Aprobada'
      case 'PENDING':
        return 'Pendiente'
      case 'DECLINED':
        return 'Rechazada'
      default:
        return status
    }
  }

  if (transactionsLoading || !transactions) {
    return (
      <>
        <Header />
        <div className="transaction-history-page">
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando transacciones...</p>
          </div>
        </div>
      </>
    )
  }

  if (transactionsError) {
    return (
      <>
        <Header />
        <div className="transaction-history-page">
          <div className="error">
            <h2>Error al cargar transacciones</h2>
            <p>{transactionsError}</p>
            <button onClick={() => dispatch(fetchMyTransactions())}>
              Reintentar
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="transaction-history-page">
        <div className="container">
          <h1>Mis Transacciones</h1>
        
        {transactions.length === 0 ? (
          <div className="empty-state">
            <p>No tienes transacciones aún</p>
            <button onClick={() => navigate('/products')}>
              Ir a Productos
            </button>
          </div>
        ) : (
          <div className="transactions-list">
            {transactions.map((transaction) => (
              <div key={transaction.transactionId} className="transaction-card">
                <div className="transaction-header">
                  <div className="transaction-info">
                    <h3>Referencia: {transaction.reference}</h3>
                    <p className="transaction-date">{formatDate(transaction.createdAt)}</p>
                  </div>
                  <div className={getStatusBadgeClass(transaction.status)}>
                    {getStatusText(transaction.status)}
                  </div>
                </div>

                <div className="transaction-body">
                  <div className="transaction-details">
                    <div className="detail-row">
                      <span className="detail-label">Monto Total:</span>
                      <span className="detail-value">{formatCurrency(transaction.amount)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Método de Pago:</span>
                      <span className="detail-value">{transaction.paymentMethod}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">ID Wompi:</span>
                      <span className="detail-value wompi-id">{transaction.wompiTransactionId}</span>
                    </div>
                  </div>

                  <div className="transaction-items">
                    <h4>Productos:</h4>
                    <ul>
                      {transaction.items.map((item, index) => (
                        <li key={index}>
                          <span className="item-name">{item.productName}</span>
                          <span className="item-quantity">x{item.quantity}</span>
                          <span className="item-price">{formatCurrency(item.subtotal)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {transaction.delivery && (
                    <div className="delivery-info">
                      <h4>Información de Entrega:</h4>
                      <div className="delivery-details">
                        <p><strong>Estado:</strong> {transaction.delivery.status}</p>
                        <p><strong>Destinatario:</strong> {transaction.delivery.recipientName}</p>
                        <p><strong>Dirección:</strong> {transaction.delivery.address}</p>
                        <p><strong>Ciudad:</strong> {transaction.delivery.city}</p>
                        {transaction.delivery.trackingNumber && (
                          <p><strong>Rastreo:</strong> {transaction.delivery.trackingNumber}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default TransactionHistoryPage

import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { checkTransactionStatus, setPolling } from '@/features/cart/cartSlice'
import { FinalStatus } from '@/components/FinalStatus/FinalStatus'
import './TransactionStatusPage.scss'

export const TransactionStatusPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const statusToken = searchParams.get('token')

  const { transactionStatus } = useSelector(
    (state: RootState) => state.cart
  )

  useEffect(() => {
    // Redirigir a productos si no hay token
    if (!statusToken) {
      navigate('/products')
      return
    }

    // Iniciar polling
    dispatch(setPolling(true))
    
    // Primera consulta inmediata
    dispatch(checkTransactionStatus(statusToken))

    // Polling cada 3 segundos mientras el estado sea PENDING
    const interval = setInterval(() => {
      if (transactionStatus === 'PENDING') {
        dispatch(checkTransactionStatus(statusToken))
      } else {
        // Detener polling cuando ya no sea PENDING
        dispatch(setPolling(false))
        clearInterval(interval)
      }
    }, 3000)

    // Cleanup
    return () => {
      clearInterval(interval)
      dispatch(setPolling(false))
    }
  }, [statusToken, transactionStatus, dispatch, navigate])

  return (
    <div className="transaction-status-page">
      <FinalStatus />
    </div>
  )
}

export default TransactionStatusPage

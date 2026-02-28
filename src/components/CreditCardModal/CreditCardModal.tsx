import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setPaymentInfo } from '@/features/cart/cartSlice'
import { CreditCard } from '@/types'
import './CreditCardModal.scss'

interface CreditCardModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

interface ValidationErrors {
  cardNumber?: string
  holderName?: string
  expiryDate?: string
  cvv?: string
}

const CreditCardModal = ({ isOpen, onClose, onSubmit }: CreditCardModalProps) => {
  const dispatch = useAppDispatch()
  const existingPaymentInfo = useAppSelector((state) => state.cart.paymentInfo)

  const [cardNumber, setCardNumber] = useState('')
  const [holderName, setHolderName] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | undefined>()
  const [errors, setErrors] = useState<ValidationErrors>({})

  // Precargar datos si existen
  useEffect(() => {
    if (existingPaymentInfo) {
      setCardNumber(existingPaymentInfo.number)
      setHolderName(existingPaymentInfo.holderName)
      setExpiryDate(existingPaymentInfo.expiryDate)
      setCvv(existingPaymentInfo.cvv)
      setCardType(existingPaymentInfo.cardType)
    }
  }, [existingPaymentInfo])

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Detectar tipo de tarjeta
  const detectCardType = (number: string): 'visa' | 'mastercard' | undefined => {
    const cleaned = number.replace(/\s/g, '')
    
    // VISA: empieza con 4
    if (cleaned.startsWith('4')) {
      return 'visa'
    }
    
    // MasterCard: 51-55 o 2221-2720
    if (/^5[1-5]/.test(cleaned)) {
      return 'mastercard'
    }
    
    const first4 = cleaned.substring(0, 4)
    if (first4 >= '2221' && first4 <= '2720') {
      return 'mastercard'
    }
    
    return undefined
  }

  // Formatear número de tarjeta (espacios cada 4 dígitos)
  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '') // Solo números
    const limited = cleaned.substring(0, 16) // Máximo 16 dígitos
    const formatted = limited.match(/.{1,4}/g)?.join(' ') || limited
    return formatted
  }

  // Formatear fecha de expiración (MM/YY)
  const formatExpiryDate = (value: string): string => {
    const cleaned = value.replace(/\D/g, '') // Solo números
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`
    }
    return cleaned
  }

  // Handler para número de tarjeta
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setCardNumber(formatted)
    
    const type = detectCardType(formatted)
    setCardType(type)
    
    // Limpiar error si existe
    if (errors.cardNumber) {
      setErrors({ ...errors, cardNumber: undefined })
    }
  }

  // Handler para titular
  const handleHolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHolderName(e.target.value)
    if (errors.holderName) {
      setErrors({ ...errors, holderName: undefined })
    }
  }

  // Handler para fecha de expiración
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    setExpiryDate(formatted)
    if (errors.expiryDate) {
      setErrors({ ...errors, expiryDate: undefined })
    }
  }

  // Handler para CVV
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '') // Solo números
    const limited = cleaned.substring(0, 4) // Máximo 4 dígitos
    setCvv(limited)
    if (errors.cvv) {
      setErrors({ ...errors, cvv: undefined })
    }
  }

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}
    
    // Validar número de tarjeta
    const cleanedCardNumber = cardNumber.replace(/\s/g, '')
    if (!cleanedCardNumber) {
      newErrors.cardNumber = 'El número de tarjeta es requerido'
    } else if (cleanedCardNumber.length !== 16) {
      newErrors.cardNumber = 'El número de tarjeta debe tener 16 dígitos'
    }
    
    // Validar titular
    if (!holderName.trim()) {
      newErrors.holderName = 'El nombre del titular es requerido'
    }
    
    // Validar fecha de expiración
    if (!expiryDate) {
      newErrors.expiryDate = 'La fecha de expiración es requerida'
    } else {
      const [month, year] = expiryDate.split('/')
      const monthNum = parseInt(month, 10)
      const yearNum = parseInt(`20${year}`, 10)
      
      if (monthNum < 1 || monthNum > 12) {
        newErrors.expiryDate = 'Mes inválido'
      } else {
        const now = new Date()
        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth() + 1
        
        if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
          newErrors.expiryDate = 'Tarjeta expirada'
        }
      }
    }
    
    // Validar CVV
    if (!cvv) {
      newErrors.cvv = 'El CVV es requerido'
    } else if (cvv.length < 3) {
      newErrors.cvv = 'El CVV debe tener al menos 3 dígitos'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handler para submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // Guardar en Redux (NO se persiste por configuración de redux-persist)
    const paymentData: CreditCard = {
      number: cardNumber,
      holderName,
      expiryDate,
      cvv,
      cardType,
    }
    
    dispatch(setPaymentInfo(paymentData))
    onSubmit()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="credit-card-modal-overlay" onClick={onClose}>
      <div className="credit-card-modal" onClick={(e) => e.stopPropagation()}>
        <div className="credit-card-modal__header">
          <h2>Información de Tarjeta</h2>
          <button
            className="credit-card-modal__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <form className="credit-card-modal__form" onSubmit={handleSubmit}>
          {/* Número de tarjeta */}
          <div className="form-group">
            <label htmlFor="cardNumber">
              Número de Tarjeta *
            </label>
            <div className="card-number-input-wrapper">
              <input
                id="cardNumber"
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className={errors.cardNumber ? 'error' : ''}
                maxLength={19} // 16 dígitos + 3 espacios
              />
              {cardType && (
                <div className="card-type-indicator">
                  {cardType === 'visa' && (
                    <span className="card-logo visa" aria-label="VISA">
                      VISA
                    </span>
                  )}
                  {cardType === 'mastercard' && (
                    <span className="card-logo mastercard" aria-label="MasterCard">
                      MasterCard
                    </span>
                  )}
                </div>
              )}
            </div>
            {errors.cardNumber && (
              <span className="error-message" role="alert">
                {errors.cardNumber}
              </span>
            )}
          </div>

          {/* Titular */}
          <div className="form-group">
            <label htmlFor="holderName">
              Nombre del Titular *
            </label>
            <input
              id="holderName"
              type="text"
              value={holderName}
              onChange={handleHolderNameChange}
              placeholder="JUAN PEREZ"
              className={errors.holderName ? 'error' : ''}
            />
            {errors.holderName && (
              <span className="error-message" role="alert">
                {errors.holderName}
              </span>
            )}
          </div>

          <div className="form-row">
            {/* Fecha de expiración */}
            <div className="form-group">
              <label htmlFor="expiryDate">
                Fecha de Expiración *
              </label>
              <input
                id="expiryDate"
                type="text"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                placeholder="MM/YY"
                className={errors.expiryDate ? 'error' : ''}
                maxLength={5}
              />
              {errors.expiryDate && (
                <span className="error-message" role="alert">
                  {errors.expiryDate}
                </span>
              )}
            </div>

            {/* CVV */}
            <div className="form-group">
              <label htmlFor="cvv">
                CVV *
              </label>
              <input
                id="cvv"
                type="text"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="123"
                className={errors.cvv ? 'error' : ''}
                maxLength={4}
              />
              {errors.cvv && (
                <span className="error-message" role="alert">
                  {errors.cvv}
                </span>
              )}
            </div>
          </div>

          <div className="credit-card-modal__actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Confirmar Pago
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreditCardModal

import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setShippingAddress } from '@/features/cart/cartSlice'
import { ShippingAddress } from '@/types'
import './DeliveryForm.scss'

interface DeliveryFormProps {
  onSubmit: () => void
}

interface ValidationErrors {
  fullName?: string
  address?: string
  city?: string
  postalCode?: string
  phone?: string
}

const DeliveryForm = ({ onSubmit }: DeliveryFormProps) => {
  const dispatch = useAppDispatch()
  const existingAddress = useAppSelector((state) => state.cart.shippingAddress)

  const [fullName, setFullName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<ValidationErrors>({})

  // Precargar datos si existen
  useEffect(() => {
    if (existingAddress) {
      setFullName(existingAddress.fullName)
      setAddress(existingAddress.address)
      setCity(existingAddress.city)
      setPostalCode(existingAddress.postalCode)
      setPhone(existingAddress.phone)
    }
  }, [existingAddress])

  // Validar nombre completo
  const validateFullName = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'El nombre completo es requerido'
    }
    if (value.trim().length < 3) {
      return 'El nombre debe tener al menos 3 caracteres'
    }
    return undefined
  }

  // Validar dirección
  const validateAddress = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'La dirección es requerida'
    }
    return undefined
  }

  // Validar ciudad
  const validateCity = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'La ciudad es requerida'
    }
    return undefined
  }

  // Validar código postal
  const validatePostalCode = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'El código postal es requerido'
    }
    // Solo números y guiones
    if (!/^[0-9-]+$/.test(value)) {
      return 'Código postal inválido'
    }
    return undefined
  }

  // Validar teléfono
  const validatePhone = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'El teléfono es requerido'
    }
    // Solo números
    if (!/^[0-9]+$/.test(value)) {
      return 'El teléfono debe contener solo números'
    }
    if (value.length < 10) {
      return 'El teléfono debe tener al menos 10 dígitos'
    }
    return undefined
  }

  // Handlers con validación en tiempo real
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFullName(value)
    if (errors.fullName) {
      const error = validateFullName(value)
      if (!error) {
        setErrors({ ...errors, fullName: undefined })
      }
    }
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAddress(value)
    if (errors.address) {
      const error = validateAddress(value)
      if (!error) {
        setErrors({ ...errors, address: undefined })
      }
    }
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCity(value)
    if (errors.city) {
      const error = validateCity(value)
      if (!error) {
        setErrors({ ...errors, city: undefined })
      }
    }
  }

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPostalCode(value)
    if (errors.postalCode) {
      const error = validatePostalCode(value)
      if (!error) {
        setErrors({ ...errors, postalCode: undefined })
      }
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPhone(value)
    if (errors.phone) {
      const error = validatePhone(value)
      if (!error) {
        setErrors({ ...errors, phone: undefined })
      }
    }
  }

  // Validar todo el formulario
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    const fullNameError = validateFullName(fullName)
    if (fullNameError) newErrors.fullName = fullNameError

    const addressError = validateAddress(address)
    if (addressError) newErrors.address = addressError

    const cityError = validateCity(city)
    if (cityError) newErrors.city = cityError

    const postalCodeError = validatePostalCode(postalCode)
    if (postalCodeError) newErrors.postalCode = postalCodeError

    const phoneError = validatePhone(phone)
    if (phoneError) newErrors.phone = phoneError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handler para submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Guardar en Redux
    const shippingData: ShippingAddress = {
      fullName: fullName.trim(),
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      phone: phone.trim(),
    }

    dispatch(setShippingAddress(shippingData))
    onSubmit()
  }

  return (
    <form className="delivery-form" onSubmit={handleSubmit}>
      <div className="delivery-form__header">
        <h2>Información de Envío</h2>
        <p className="delivery-form__description">
          Complete los datos para la entrega de su pedido
        </p>
      </div>

      <div className="delivery-form__content">
        {/* Nombre completo */}
        <div className="form-group">
          <label htmlFor="fullName">
            Nombre Completo del Destinatario *
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={handleFullNameChange}
            placeholder="Juan Pérez García"
            className={errors.fullName ? 'error' : ''}
          />
          {errors.fullName && (
            <span className="error-message" role="alert">
              {errors.fullName}
            </span>
          )}
        </div>

        {/* Dirección */}
        <div className="form-group">
          <label htmlFor="address">
            Dirección de Envío *
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={handleAddressChange}
            placeholder="Calle 123 #45-67 Apto 401"
            className={errors.address ? 'error' : ''}
          />
          {errors.address && (
            <span className="error-message" role="alert">
              {errors.address}
            </span>
          )}
        </div>

        {/* Ciudad */}
        <div className="form-group">
          <label htmlFor="city">
            Ciudad *
          </label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={handleCityChange}
            placeholder="Bogotá"
            className={errors.city ? 'error' : ''}
          />
          {errors.city && (
            <span className="error-message" role="alert">
              {errors.city}
            </span>
          )}
        </div>

        <div className="form-row">
          {/* Código postal */}
          <div className="form-group">
            <label htmlFor="postalCode">
              Código Postal *
            </label>
            <input
              id="postalCode"
              type="text"
              value={postalCode}
              onChange={handlePostalCodeChange}
              placeholder="110111"
              className={errors.postalCode ? 'error' : ''}
            />
            {errors.postalCode && (
              <span className="error-message" role="alert">
                {errors.postalCode}
              </span>
            )}
          </div>

          {/* Teléfono */}
          <div className="form-group">
            <label htmlFor="phone">
              Teléfono *
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="3001234567"
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && (
              <span className="error-message" role="alert">
                {errors.phone}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="delivery-form__actions">
        <button type="submit" className="btn-primary">
          Continuar al Pago
        </button>
      </div>
    </form>
  )
}

export default DeliveryForm

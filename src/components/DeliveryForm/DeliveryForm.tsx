import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setShippingAddress, setCustomerEmail } from '@/features/cart/cartSlice'
import { ShippingAddress } from '@/types'
import './DeliveryForm.scss'

interface DeliveryFormProps {
  onSubmit: () => void
}

interface ValidationErrors {
  recipientName?: string
  addressLine1?: string
  city?: string
  region?: string
  country?: string
  recipientPhone?: string
  email?: string
}

const DeliveryForm = ({ onSubmit }: DeliveryFormProps) => {
  const dispatch = useAppDispatch()
  const existingAddress = useAppSelector((state) => state.cart.shippingAddress)
  const existingEmail = useAppSelector((state) => state.cart.customerEmail)

  const [recipientName, setRecipientName] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [city, setCity] = useState('')
  const [region, setRegion] = useState('')
  const [country, setCountry] = useState('Colombia')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<ValidationErrors>({})

  // Precargar datos si existen
  useEffect(() => {
    if (existingAddress) {
      setRecipientName(existingAddress.recipientName)
      setAddressLine1(existingAddress.addressLine1)
      setCity(existingAddress.city)
      setRegion(existingAddress.region)
      setCountry(existingAddress.country)
      setRecipientPhone(existingAddress.recipientPhone)
    }
    if (existingEmail) {
      setEmail(existingEmail)
    }
  }, [existingAddress, existingEmail])

  // Validar nombre del destinatario
  const validateRecipientName = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'El nombre del destinatario es requerido'
    }
    if (value.trim().length < 3) {
      return 'El nombre debe tener al menos 3 caracteres'
    }
    return undefined
  }

  // Validar dirección
  const validateAddressLine1 = (value: string): string | undefined => {
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

  // Validar región/departamento
  const validateRegion = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'La región/departamento es requerida'
    }
    return undefined
  }

  // Validar país
  const validateCountry = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'El país es requerido'
    }
    return undefined
  }

  // Validar teléfono
  const validateRecipientPhone = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'El teléfono es requerido'
    }
    // Formato colombiano con +57
    if (!/^\+57[0-9]{10}$/.test(value)) {
      return 'El teléfono debe tener el formato +573001234567'
    }
    return undefined
  }

  // Validar email
  const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'El email es requerido'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Email inválido'
    }
    return undefined
  }

  // Handlers con validación en tiempo real
  const handleRecipientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setRecipientName(value)
    if (errors.recipientName) {
      const error = validateRecipientName(value)
      if (!error) {
        setErrors({ ...errors, recipientName: undefined })
      }
    }
  }

  const handleAddressLine1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAddressLine1(value)
    if (errors.addressLine1) {
      const error = validateAddressLine1(value)
      if (!error) {
        setErrors({ ...errors, addressLine1: undefined })
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

  const handleRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setRegion(value)
    if (errors.region) {
      const error = validateRegion(value)
      if (!error) {
        setErrors({ ...errors, region: undefined })
      }
    }
  }

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCountry(value)
    if (errors.country) {
      const error = validateCountry(value)
      if (!error) {
        setErrors({ ...errors, country: undefined })
      }
    }
  }

  const handleRecipientPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setRecipientPhone(value)
    if (errors.recipientPhone) {
      const error = validateRecipientPhone(value)
      if (!error) {
        setErrors({ ...errors, recipientPhone: undefined })
      }
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (errors.email) {
      const error = validateEmail(value)
      if (!error) {
        setErrors({ ...errors, email: undefined })
      }
    }
  }

  // Validar todo el formulario
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    const recipientNameError = validateRecipientName(recipientName)
    if (recipientNameError) newErrors.recipientName = recipientNameError

    const addressLine1Error = validateAddressLine1(addressLine1)
    if (addressLine1Error) newErrors.addressLine1 = addressLine1Error

    const cityError = validateCity(city)
    if (cityError) newErrors.city = cityError

    const regionError = validateRegion(region)
    if (regionError) newErrors.region = regionError

    const countryError = validateCountry(country)
    if (countryError) newErrors.country = countryError

    const recipientPhoneError = validateRecipientPhone(recipientPhone)
    if (recipientPhoneError) newErrors.recipientPhone = recipientPhoneError

    const emailError = validateEmail(email)
    if (emailError) newErrors.email = emailError

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
      recipientName: recipientName.trim(),
      addressLine1: addressLine1.trim(),
      city: city.trim(),
      region: region.trim(),
      country: country.trim(),
      recipientPhone: recipientPhone.trim(),
    }

    dispatch(setShippingAddress(shippingData))
    dispatch(setCustomerEmail(email.trim()))
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
        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">
            Email *
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={handleEmailChange}
            placeholder="customer@test.com"
            className={errors.email ? 'error' : ''}
          />
          {errors.email && (
            <span className="error-message" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        {/* Nombre del destinatario */}
        <div className="form-group">
          <label htmlFor="recipientName">
            Nombre Completo del Destinatario *
          </label>
          <input
            id="recipientName"
            type="text"
            value={recipientName}
            onChange={handleRecipientNameChange}
            placeholder="Juan Pérez"
            className={errors.recipientName ? 'error' : ''}
          />
          {errors.recipientName && (
            <span className="error-message" role="alert">
              {errors.recipientName}
            </span>
          )}
        </div>

        {/* Dirección */}
        <div className="form-group">
          <label htmlFor="addressLine1">
            Dirección de Envío *
          </label>
          <input
            id="addressLine1"
            type="text"
            value={addressLine1}
            onChange={handleAddressLine1Change}
            placeholder="Calle 123 #45-67"
            className={errors.addressLine1 ? 'error' : ''}
          />
          {errors.addressLine1 && (
            <span className="error-message" role="alert">
              {errors.addressLine1}
            </span>
          )}
        </div>

        {/* Ciudad y Región */}
        <div className="form-row">
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

          <div className="form-group">
            <label htmlFor="region">
              Departamento *
            </label>
            <input
              id="region"
              type="text"
              value={region}
              onChange={handleRegionChange}
              placeholder="Cundinamarca"
              className={errors.region ? 'error' : ''}
            />
            {errors.region && (
              <span className="error-message" role="alert">
                {errors.region}
              </span>
            )}
          </div>
        </div>

        {/* País y Teléfono */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="country">
              País *
            </label>
            <input
              id="country"
              type="text"
              value={country}
              onChange={handleCountryChange}
              placeholder="Colombia"
              className={errors.country ? 'error' : ''}
            />
            {errors.country && (
              <span className="error-message" role="alert">
                {errors.country}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="recipientPhone">
              Teléfono *
            </label>
            <input
              id="recipientPhone"
              type="tel"
              value={recipientPhone}
              onChange={handleRecipientPhoneChange}
              placeholder="+573001234567"
              className={errors.recipientPhone ? 'error' : ''}
            />
            {errors.recipientPhone && (
              <span className="error-message" role="alert">
                {errors.recipientPhone}
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

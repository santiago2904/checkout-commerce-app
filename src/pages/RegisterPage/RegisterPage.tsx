import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { register, clearAuthError } from '@/features/auth/authSlice'
import Header from '@/components/Header/Header'
import './RegisterPage.scss'

const RegisterPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  })

  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  })

  useEffect(() => {
    // Limpiar errores al montar el componente
    dispatch(clearAuthError())
  }, [dispatch])

  useEffect(() => {
    // Redirigir a productos si ya está autenticado
    if (isAuthenticated) {
      navigate('/products')
    }
  }, [isAuthenticated, navigate])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Limpiar error de validación al escribir
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación del formulario
    const errors = {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    }

    if (!formData.email) {
      errors.email = 'El email es requerido'
    } else if (!validateEmail(formData.email)) {
      errors.email = 'El email no es válido'
    }

    if (!formData.firstName) {
      errors.firstName = 'El nombre es requerido'
    } else if (formData.firstName.length < 2) {
      errors.firstName = 'El nombre debe tener al menos 2 caracteres'
    }

    if (!formData.lastName) {
      errors.lastName = 'El apellido es requerido'
    } else if (formData.lastName.length < 2) {
      errors.lastName = 'El apellido debe tener al menos 2 caracteres'
    }

    if (!formData.password) {
      errors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres'
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden'
    }

    if (Object.values(errors).some((error) => error)) {
      setValidationErrors(errors)
      return
    }

    // Enviar registro (sin confirmPassword)
    const { confirmPassword, ...registerData } = formData
    dispatch(register(registerData))
  }

  return (
    <>
      <Header />
      <div className="register-page">
        <div className="register-page__container">
          <div className="register-page__card">
            <h1 className="register-page__title">Crear Cuenta</h1>
            
            {error && (
              <div className="register-page__error">
                {error}
              </div>
            )}

            <form className="register-page__form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">Nombre</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={validationErrors.firstName ? 'error' : ''}
                    placeholder="Juan"
                  />
                  {validationErrors.firstName && (
                    <span className="form-group__error">{validationErrors.firstName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Apellido</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={validationErrors.lastName ? 'error' : ''}
                    placeholder="Pérez"
                  />
                  {validationErrors.lastName && (
                    <span className="form-group__error">{validationErrors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={validationErrors.email ? 'error' : ''}
                  placeholder="tu@email.com"
                />
                {validationErrors.email && (
                  <span className="form-group__error">{validationErrors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={validationErrors.password ? 'error' : ''}
                  placeholder="••••••••"
                />
                {validationErrors.password && (
                  <span className="form-group__error">{validationErrors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={validationErrors.confirmPassword ? 'error' : ''}
                  placeholder="••••••••"
                />
                {validationErrors.confirmPassword && (
                  <span className="form-group__error">{validationErrors.confirmPassword}</span>
                )}
              </div>

              <button
                type="submit"
                className="register-page__submit"
                disabled={loading}
              >
                {loading ? 'Creando cuenta...' : 'Registrarse'}
              </button>
            </form>

            <div className="register-page__footer">
              <p>
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="register-page__link">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RegisterPage

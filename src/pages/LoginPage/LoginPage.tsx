import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { login, clearAuthError } from '@/features/auth/authSlice'
import Header from '@/components/Header/Header'
import './LoginPage.scss'

const LoginPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
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
    }

    if (!formData.email) {
      errors.email = 'El email es requerido'
    } else if (!validateEmail(formData.email)) {
      errors.email = 'El email no es válido'
    }

    if (!formData.password) {
      errors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    if (errors.email || errors.password) {
      setValidationErrors(errors)
      return
    }

    // Enviar login
    dispatch(login(formData))
  }

  return (
    <>
      <Header />
      <div className="login-page">
        <div className="login-page__container">
          <div className="login-page__card">
            <h1 className="login-page__title">Iniciar Sesión</h1>
            
            {error && (
              <div className="login-page__error">
                {error}
              </div>
            )}

            <form className="login-page__form" onSubmit={handleSubmit}>
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

              <button
                type="submit"
                className="login-page__submit"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="login-page__footer">
              <p>
                ¿No tienes una cuenta?{' '}
                <Link to="/register" className="login-page__link">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage

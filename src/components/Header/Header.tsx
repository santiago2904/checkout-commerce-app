import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logout } from '@/features/auth/authSlice'
import './Header.scss'

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user, customer } = useAppSelector((state) => state.auth)
  const { items } = useAppSelector((state) => state.cart)

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)

  const handleCartClick = () => {
    if (items.length > 0) {
      navigate('/checkout')
    }
  }

  const handleLogoClick = () => {
    navigate('/products')
  }

  const handleLoginClick = () => {
    navigate('/login')
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/products')
  }

  const getUserName = () => {
    if (customer) {
      return `${customer.firstName} ${customer.lastName}`
    }
    if (user) {
      return user.email.split('@')[0]
    }
    return 'Usuario'
  }

  return (
    <header className="app-header" role="banner">
      <div className="app-header__container">
        {/* Logo y nombre */}
        <div className="app-header__brand" onClick={handleLogoClick}>
          <div className="app-header__logo" aria-label="Logo de la tienda">
            🛒
          </div>
          <h1 className="app-header__title">Checkout Store</h1>
        </div>

        {/* Navegación derecha */}
        <nav className="app-header__nav" aria-label="Navegación principal">
          {/* Carrito */}
          <button
            className="app-header__cart-btn"
            onClick={handleCartClick}
            aria-label={`Carrito de compras con ${cartItemsCount} ${
              cartItemsCount === 1 ? 'artículo' : 'artículos'
            }`}
            disabled={items.length === 0}
          >
            <span className="cart-icon">🛒</span>
            {cartItemsCount > 0 && (
              <span className="cart-badge" aria-live="polite">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* Login/Usuario */}
          {isAuthenticated ? (
            <div className="app-header__user-section">
              <div className="app-header__user" aria-label="Usuario autenticado">
                <span className="user-icon">👤</span>
                <span className="user-name">{getUserName()}</span>
              </div>
              <button
                className="app-header__logout-btn"
                onClick={handleLogout}
                aria-label="Cerrar sesión"
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              className="app-header__login-btn"
              onClick={handleLoginClick}
              aria-label="Iniciar sesión"
            >
              Iniciar sesión
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header

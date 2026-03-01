import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchProducts } from '@/features/products/productsSlice'
import { addToCart } from '@/features/cart/cartSlice'
import { Product } from '@/types'
import Header from '@/components/Header/Header'
import './ProductPage.scss'

const ProductPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items: products, loading, error } = useAppSelector((state) => state.products)
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // Cargar productos al montar el componente
    dispatch(fetchProducts())
  }, [dispatch])

  const handleBuyProduct = (product: Product) => {
    if (product.stock > 0) {
      dispatch(addToCart({ product, quantity: 1 }))
      // Navegar a checkout
      navigate('/checkout')
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="product-page">
          <div className="loading">Cargando productos...</div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="product-page">
          <div className="error">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => dispatch(fetchProducts())}>Reintentar</button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="product-page">
        <div className="product-page__header">
          <h1>Productos Disponibles</h1>
          {!isAuthenticated && (
            <p className="auth-warning">⚠️ Inicia sesión para completar tu compra</p>
          )}
        </div>

      <div className="product-page__grid">
        {products.length === 0 ? (
          <div className="empty-state">
            <p>No hay productos disponibles en este momento.</p>
          </div>
        ) : (
          products.map((product) => (
            <article key={product.id} className="product-card">
              {product.imageUrl && (
                <div className="product-card__image">
                  <img src={product.imageUrl} alt={product.name} />
                </div>
              )}
              <div className="product-card__content">
                <h2 className="product-card__title">{product.name}</h2>
                <p className="product-card__description">{product.description}</p>
                <div className="product-card__footer">
                  <div className="product-card__info">
                    <span className="product-card__price">
                      ${product.price.toLocaleString('es-CO')}
                    </span>
                    <span
                      className={`product-card__stock ${
                        product.stock === 0 ? 'product-card__stock--out' : ''
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} disponibles`
                        : 'Agotado'}
                    </span>
                  </div>
                  <button
                    className="product-card__button"
                    onClick={() => handleBuyProduct(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? 'Comprar' : 'No disponible'}
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
    </>
  )
}

export default ProductPage

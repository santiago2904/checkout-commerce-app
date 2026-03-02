import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProductPage from './pages/ProductPage/ProductPage'
import CheckoutPage from './pages/CheckoutPage/CheckoutPage'
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import TransactionStatusPage from './pages/TransactionStatusPage/TransactionStatusPage'
import './App.scss'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/transaction-status" element={<TransactionStatusPage />} />
          <Route path="/checkout/summary" element={<div style={{padding: '2rem'}}>Summary Page - Coming Soon</div>} />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

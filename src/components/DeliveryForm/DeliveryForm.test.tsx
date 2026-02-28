import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import DeliveryForm from './DeliveryForm'
import cartReducer from '@/features/cart/cartSlice'

// Helper para crear un store de prueba
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: initialState,
  })
}

// Helper para renderizar con Provider
const renderWithStore = (component: React.ReactElement, initialState = {}) => {
  const store = createTestStore(initialState)
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  }
}

describe('DeliveryForm Component', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering inicial', () => {
    it('debe renderizar el formulario de envío', () => {
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      expect(screen.getByText(/información de envío|datos de envío/i)).toBeInTheDocument()
    })

    it('debe renderizar todos los campos requeridos', () => {
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      expect(screen.getByLabelText(/nombre completo|destinatario/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/ciudad/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/código postal/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument()
    })

    it('debe tener un botón de continuar', () => {
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      expect(submitButton).toBeInTheDocument()
    })
  })

  describe('Validaciones de campos requeridos', () => {
    it('debe mostrar error cuando el nombre está vacío', async () => {
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/nombre.*requerido/i)).toBeInTheDocument()
      })
    })

    it('debe mostrar error cuando la dirección está vacía', async () => {
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/dirección.*requerida/i)).toBeInTheDocument()
      })
    })

    it('debe mostrar error cuando la ciudad está vacía', async () => {
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/ciudad.*requerida/i)).toBeInTheDocument()
      })
    })

    it('debe mostrar error cuando el código postal está vacío', async () => {
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/código postal.*requerido/i)).toBeInTheDocument()
      })
    })

    it('debe mostrar error cuando el teléfono está vacío', async () => {
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/teléfono.*requerido/i)).toBeInTheDocument()
      })
    })

    it('debe mostrar todos los errores cuando todos los campos están vacíos', async () => {
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errors = screen.getAllByText(/requerido|requerida/i)
        expect(errors.length).toBeGreaterThanOrEqual(5)
      })
    })
  })

  describe('Validaciones específicas', () => {
    it('debe validar que el nombre tenga al menos 3 caracteres', async () => {
      const user = userEvent.setup()
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      const nameInput = screen.getByLabelText(/nombre completo|destinatario/i)
      await user.type(nameInput, 'ab')
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(
          screen.getByText(/nombre.*al menos.*caracteres/i)
        ).toBeInTheDocument()
      })
    })

    it('debe validar formato de código postal', async () => {
      const user = userEvent.setup()
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      const postalInput = screen.getByLabelText(/código postal/i)
      await user.type(postalInput, 'abc')
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(
          screen.getByText(/código postal.*inválido/i)
        ).toBeInTheDocument()
      })
    })

    it('debe validar formato de teléfono (solo números)', async () => {
      const user = userEvent.setup()
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      const phoneInput = screen.getByLabelText(/teléfono/i)
      await user.type(phoneInput, 'abc123')
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(
          screen.getByText(/teléfono.*inválido|solo números/i)
        ).toBeInTheDocument()
      })
    })

    it('debe validar longitud mínima del teléfono (10 dígitos)', async () => {
      const user = userEvent.setup()
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      const phoneInput = screen.getByLabelText(/teléfono/i)
      await user.type(phoneInput, '123456')
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(
          screen.getByText(/teléfono.*10.*dígitos/i)
        ).toBeInTheDocument()
      })
    })
  })

  describe('Interacción del usuario', () => {
    it('debe permitir llenar todos los campos', async () => {
      const user = userEvent.setup()
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      await user.type(screen.getByLabelText(/nombre completo|destinatario/i), 'Juan Pérez')
      await user.type(screen.getByLabelText(/dirección/i), 'Calle 123 #45-67')
      await user.type(screen.getByLabelText(/ciudad/i), 'Bogotá')
      await user.type(screen.getByLabelText(/código postal/i), '110111')
      await user.type(screen.getByLabelText(/teléfono/i), '3001234567')
      
      const nameInput = screen.getByLabelText(/nombre completo|destinatario/i) as HTMLInputElement
      expect(nameInput.value).toBe('Juan Pérez')
    })

    it('debe limpiar los errores cuando se corrige un campo', async () => {
      const user = userEvent.setup()
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      // Intentar submit para generar errores
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/nombre.*requerido/i)).toBeInTheDocument()
      })
      
      // Corregir el campo
      const nameInput = screen.getByLabelText(/nombre completo|destinatario/i)
      await user.type(nameInput, 'Juan Pérez')
      
      await waitFor(() => {
        expect(screen.queryByText(/nombre.*requerido/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Guardado en Redux', () => {
    it('debe guardar los datos en Redux cuando el formulario es válido', async () => {
      const user = userEvent.setup()
      const { store } = renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      await user.type(screen.getByLabelText(/nombre completo|destinatario/i), 'Juan Pérez')
      await user.type(screen.getByLabelText(/dirección/i), 'Calle 123 #45-67')
      await user.type(screen.getByLabelText(/ciudad/i), 'Bogotá')
      await user.type(screen.getByLabelText(/código postal/i), '110111')
      await user.type(screen.getByLabelText(/teléfono/i), '3001234567')
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const state = store.getState()
        expect(state.cart.shippingAddress).toBeDefined()
        expect(state.cart.shippingAddress?.fullName).toBe('Juan Pérez')
        expect(state.cart.shippingAddress?.address).toBe('Calle 123 #45-67')
        expect(state.cart.shippingAddress?.city).toBe('Bogotá')
        expect(state.cart.shippingAddress?.postalCode).toBe('110111')
        expect(state.cart.shippingAddress?.phone).toBe('3001234567')
      })
    })

    it('debe llamar onSubmit después de guardar datos válidos', async () => {
      const user = userEvent.setup()
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      await user.type(screen.getByLabelText(/nombre completo|destinatario/i), 'Juan Pérez')
      await user.type(screen.getByLabelText(/dirección/i), 'Calle 123 #45-67')
      await user.type(screen.getByLabelText(/ciudad/i), 'Bogotá')
      await user.type(screen.getByLabelText(/código postal/i), '110111')
      await user.type(screen.getByLabelText(/teléfono/i), '3001234567')
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1)
      })
    })

    it('NO debe llamar onSubmit si el formulario es inválido', async () => {
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/nombre.*requerido/i)).toBeInTheDocument()
      })
      
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })

  describe('Precarga de datos desde Redux', () => {
    it('debe precargar los datos si ya existen en Redux', () => {
      const initialState = {
        cart: {
          items: [],
          shippingAddress: {
            fullName: 'María García',
            address: 'Carrera 50 #20-30',
            city: 'Medellín',
            postalCode: '050001',
            phone: '3109876543',
          },
          paymentInfo: null,
        },
      }
      
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />, initialState)
      
      const nameInput = screen.getByLabelText(/nombre completo|destinatario/i) as HTMLInputElement
      const addressInput = screen.getByLabelText(/dirección/i) as HTMLInputElement
      const cityInput = screen.getByLabelText(/ciudad/i) as HTMLInputElement
      
      expect(nameInput.value).toBe('María García')
      expect(addressInput.value).toBe('Carrera 50 #20-30')
      expect(cityInput.value).toBe('Medellín')
    })
  })

  describe('Accesibilidad', () => {
    it('debe tener labels asociados a todos los inputs', () => {
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      expect(screen.getByLabelText(/nombre completo|destinatario/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/ciudad/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/código postal/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument()
    })

    it('debe mostrar los mensajes de error de forma accesible', async () => {
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errors = screen.getAllByRole('alert')
        expect(errors.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Diseño responsive', () => {
    it('debe aplicar clases para diseño mobile-first', () => {
      const { container } = renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      const form = container.querySelector('form')
      expect(form).toHaveClass(/delivery-form/i)
    })
  })
})

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
      
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/nombre completo|destinatario/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/ciudad/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/departamento|región/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/país/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument()
    })

    it('debe tener un botón de continuar', () => {
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      expect(submitButton).toBeInTheDocument()
    })
  })

  describe('Validaciones de campos requeridos', () => {
    it('debe mostrar error cuando el email está vacío', async () => {
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/email.*requerido/i)).toBeInTheDocument()
      })
    })

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

    it('debe mostrar error cuando la región está vacía', async () => {
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/región.*requerida|departamento.*requerida/i)).toBeInTheDocument()
      })
    })

    it('debe mostrar error cuando el país está vacío', async () => {
      const user = userEvent.setup()
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      // Clear the default 'Colombia' value
      const countryInput = screen.getByLabelText(/país/i)
      await user.clear(countryInput)
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/país.*requerido/i)).toBeInTheDocument()
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
      const user = userEvent.setup()
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      // Clear the default country value
      const countryInput = screen.getByLabelText(/país/i)
      await user.clear(countryInput)
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const errors = screen.getAllByText(/requerido|requerida/i)
        expect(errors.length).toBeGreaterThanOrEqual(7)
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

    it('debe validar formato de email', async () => {
      const user = userEvent.setup()
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      // Fill all fields with valid values except email
      await user.type(screen.getByLabelText(/nombre completo|destinatario/i), 'Juan Pérez')
      await user.type(screen.getByLabelText(/dirección/i), 'Calle 123 #45-67')
      await user.type(screen.getByLabelText(/ciudad/i), 'Bogotá')
      await user.type(screen.getByLabelText(/departamento|región/i), 'Cundinamarca')
      await user.type(screen.getByLabelText(/teléfono/i), '+573001234567')
      
      // Fill email with invalid format
      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'invalid-email-format')
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(
          screen.getByText(/email.*inválido/i)
        ).toBeInTheDocument()
      })
    })

    it('debe validar formato de teléfono colombiano', async () => {
      const user = userEvent.setup()
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      const phoneInput = screen.getByLabelText(/teléfono/i)
      await user.type(phoneInput, '3001234567')
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(
          screen.getByText(/teléfono.*formato.*\+573001234567/i)
        ).toBeInTheDocument()
      })
    })

    it('debe aceptar teléfono en formato correcto', async () => {
      const user = userEvent.setup()
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      await user.type(screen.getByLabelText(/email/i), 'test@test.com')
      await user.type(screen.getByLabelText(/nombre completo|destinatario/i), 'Juan Pérez')
      await user.type(screen.getByLabelText(/dirección/i), 'Calle 123 #45-67')
      await user.type(screen.getByLabelText(/ciudad/i), 'Bogotá')
      await user.type(screen.getByLabelText(/departamento|región/i), 'Cundinamarca')
      const phoneInput = screen.getByLabelText(/teléfono/i)
      await user.type(phoneInput, '+573001234567')
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
      })
    })
  })

  describe('Interacción del usuario', () => {
    it('debe permitir llenar todos los campos', async () => {
      const user = userEvent.setup()
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      await user.type(screen.getByLabelText(/email/i), 'test@test.com')
      await user.type(screen.getByLabelText(/nombre completo|destinatario/i), 'Juan Pérez')
      await user.type(screen.getByLabelText(/dirección/i), 'Calle 123 #45-67')
      await user.type(screen.getByLabelText(/ciudad/i), 'Bogotá')
      await user.type(screen.getByLabelText(/departamento|región/i), 'Cundinamarca')
      await user.type(screen.getByLabelText(/teléfono/i), '+573001234567')
      
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
      
      await user.type(screen.getByLabelText(/email/i), 'customer@test.com')
      await user.type(screen.getByLabelText(/nombre completo|destinatario/i), 'Juan Pérez')
      await user.type(screen.getByLabelText(/dirección/i), 'Calle 123 #45-67')
      await user.type(screen.getByLabelText(/ciudad/i), 'Bogotá')
      await user.type(screen.getByLabelText(/departamento|región/i), 'Cundinamarca')
      await user.type(screen.getByLabelText(/teléfono/i), '+573001234567')
      
      const submitButton = screen.getByRole('button', { name: /continuar|siguiente/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const state = store.getState()
        expect(state.cart.shippingAddress).toBeDefined()
        expect(state.cart.shippingAddress?.recipientName).toBe('Juan Pérez')
        expect(state.cart.shippingAddress?.addressLine1).toBe('Calle 123 #45-67')
        expect(state.cart.shippingAddress?.city).toBe('Bogotá')
        expect(state.cart.shippingAddress?.region).toBe('Cundinamarca')
        expect(state.cart.shippingAddress?.country).toBe('Colombia')
        expect(state.cart.shippingAddress?.recipientPhone).toBe('+573001234567')
        expect(state.cart.customerEmail).toBe('customer@test.com')
      })
    })

    it('debe llamar onSubmit después de guardar datos válidos', async () => {
      const user = userEvent.setup()
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      await user.type(screen.getByLabelText(/email/i), 'test@test.com')
      await user.type(screen.getByLabelText(/nombre completo|destinatario/i), 'Juan Pérez')
      await user.type(screen.getByLabelText(/dirección/i), 'Calle 123 #45-67')
      await user.type(screen.getByLabelText(/ciudad/i), 'Bogotá')
      await user.type(screen.getByLabelText(/departamento|región/i), 'Cundinamarca')
      await user.type(screen.getByLabelText(/teléfono/i), '+573001234567')
      
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
            recipientName: 'María García',
            addressLine1: 'Carrera 50 #20-30',
            city: 'Medellín',
            region: 'Antioquia',
            country: 'Colombia',
            recipientPhone: '+573109876543',
          },
          paymentInfo: null,
          customerEmail: 'maria@test.com',
        },
      }
      
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />, initialState)
      
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
      const nameInput = screen.getByLabelText(/nombre completo|destinatario/i) as HTMLInputElement
      const addressInput = screen.getByLabelText(/dirección/i) as HTMLInputElement
      const cityInput = screen.getByLabelText(/ciudad/i) as HTMLInputElement
      
      expect(emailInput.value).toBe('maria@test.com')
      expect(nameInput.value).toBe('María García')
      expect(addressInput.value).toBe('Carrera 50 #20-30')
      expect(cityInput.value).toBe('Medellín')
    })
  })

  describe('Accesibilidad', () => {
    it('debe tener labels asociados a todos los inputs', () => {
      renderWithStore(<DeliveryForm onSubmit={mockOnSubmit} />)
      
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/nombre completo|destinatario/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/ciudad/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/departamento|región/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/país/i)).toBeInTheDocument()
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

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import CreditCardModal from './CreditCardModal'
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

describe('CreditCardModal Component', () => {
  const mockOnClose = jest.fn()
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering inicial', () => {
    it('debe renderizar el modal cuando está abierto', () => {
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      expect(screen.getByText(/información de tarjeta/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/número de tarjeta/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/titular/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/fecha de expiración/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/cvv/i)).toBeInTheDocument()
    })

    it('NO debe renderizar cuando isOpen es false', () => {
      renderWithStore(
        <CreditCardModal isOpen={false} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      expect(screen.queryByText(/información de tarjeta/i)).not.toBeInTheDocument()
    })

    it('debe tener un botón de cerrar', () => {
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      const closeButton = screen.getByRole('button', { name: /cerrar|close/i })
      expect(closeButton).toBeInTheDocument()
    })

    it('debe tener un botón de confirmar pago', () => {
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      const submitButton = screen.getByRole('button', { name: /confirmar|pagar/i })
      expect(submitButton).toBeInTheDocument()
    })
  })

  describe('Detección de tipo de tarjeta - VISA', () => {
    it('debe detectar VISA cuando el número empieza con 4', async () => {
      const user = userEvent.setup()
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      const cardInput = screen.getByLabelText(/número de tarjeta/i)
      await user.type(cardInput, '4111111111111111')
      
      // Buscar el logo o texto de VISA
      await waitFor(() => {
        expect(screen.getByAltText(/visa/i) || screen.getByText(/visa/i)).toBeInTheDocument()
      })
    })

    it('debe detectar VISA incluso con solo el primer dígito', async () => {
      const user = userEvent.setup()
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      const cardInput = screen.getByLabelText(/número de tarjeta/i)
      await user.type(cardInput, '4')
      
      await waitFor(() => {
        expect(screen.getByAltText(/visa/i) || screen.getByText(/visa/i)).toBeInTheDocument()
      })
    })
  })

  describe('Detección de tipo de tarjeta - MasterCard', () => {
    it('debe detectar MasterCard cuando empieza con 51', async () => {
      const user = userEvent.setup()
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      const cardInput = screen.getByLabelText(/número de tarjeta/i)
      await user.type(cardInput, '5111111111111111')
      
      await waitFor(() => {
        expect(
          screen.getByAltText(/mastercard/i) || screen.getByText(/mastercard/i)
        ).toBeInTheDocument()
      })
    })

    it('debe detectar MasterCard cuando empieza con 55', async () => {
      const user = userEvent.setup()
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      const cardInput = screen.getByLabelText(/número de tarjeta/i)
      await user.type(cardInput, '5555555555554444')
      
      await waitFor(() => {
        expect(
          screen.getByAltText(/mastercard/i) || screen.getByText(/mastercard/i)
        ).toBeInTheDocument()
      })
    })

    it('debe detectar MasterCard cuando empieza con 2221', async () => {
      const user = userEvent.setup()
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      const cardInput = screen.getByLabelText(/número de tarjeta/i)
      await user.type(cardInput, '2221000000000000')
      
      await waitFor(() => {
        expect(
          screen.getByAltText(/mastercard/i) || screen.getByText(/mastercard/i)
        ).toBeInTheDocument()
      })
    })

    it('debe detectar MasterCard en el rango 2221-2720', async () => {
      const user = userEvent.setup()
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      const cardInput = screen.getByLabelText(/número de tarjeta/i)
      await user.type(cardInput, '2500000000000000')
      
      await waitFor(() => {
        expect(
          screen.getByAltText(/mastercard/i) || screen.getByText(/mastercard/i)
        ).toBeInTheDocument()
      })
    })
  })

  describe('Formateo del número de tarjeta', () => {
    it('debe formatear el número con espacios cada 4 dígitos', async () => {
      const user = userEvent.setup()
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      const cardInput = screen.getByLabelText(/número de tarjeta/i) as HTMLInputElement
      await user.type(cardInput, '4111111111111111')
      
      await waitFor(() => {
        expect(cardInput.value).toBe('4111 1111 1111 1111')
      })
    })

    it('debe permitir solo números en el campo de tarjeta', async () => {
      const user = userEvent.setup()
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      const cardInput = screen.getByLabelText(/número de tarjeta/i) as HTMLInputElement
      await user.type(cardInput, '4111abc111')
      
      // Solo los números deben quedar
      await waitFor(() => {
        expect(cardInput.value).not.toContain('abc')
        expect(cardInput.value.replace(/\s/g, '')).toBe('4111111')
      })
    })

    it('debe limitar el número de tarjeta a 16 dígitos', async () => {
      const user = userEvent.setup()
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      const cardInput = screen.getByLabelText(/número de tarjeta/i) as HTMLInputElement
      await user.type(cardInput, '41111111111111119999')
      
      await waitFor(() => {
        const digitsOnly = cardInput.value.replace(/\s/g, '')
        expect(digitsOnly.length).toBeLessThanOrEqual(16)
      })
    })
  })

  describe('Validación de fecha de expiración', () => {
    it('debe formatear la fecha como MM/YY', async () => {
      const user = userEvent.setup()
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      const expiryInput = screen.getByLabelText(/fecha de expiración/i) as HTMLInputElement
      await user.type(expiryInput, '1225')
      
      await waitFor(() => {
        expect(expiryInput.value).toBe('12/25')
      })
    })

    it('debe validar que el mes sea válido (01-12)', async () => {
      const user = userEvent.setup()
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      const expiryInput = screen.getByLabelText(/fecha de expiración/i)
      const submitButton = screen.getByRole('button', { name: /confirmar|pagar/i })
      
      await user.type(expiryInput, '13/25')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/mes inválido|fecha inválida/i)).toBeInTheDocument()
      })
    })

    it('debe validar que la fecha no esté expirada', async () => {
      const user = userEvent.setup()
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      const expiryInput = screen.getByLabelText(/fecha de expiración/i)
      const submitButton = screen.getByRole('button', { name: /confirmar|pagar/i })
      
      // Fecha en el pasado
      await user.type(expiryInput, '01/20')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(
          screen.getByText(/tarjeta expirada|fecha expirada/i)
        ).toBeInTheDocument()
      })
    })
  })

  describe('Validación de CVV', () => {
    it('debe permitir solo números en CVV', async () => {
      const user = userEvent.setup()
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      const cvvInput = screen.getByLabelText(/cvv|cvc/i) as HTMLInputElement
      await user.type(cvvInput, '12a3')
      
      await waitFor(() => {
        expect(cvvInput.value).not.toContain('a')
      })
    })

    it('debe limitar CVV a 3-4 dígitos', async () => {
      const user = userEvent.setup()
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      const cvvInput = screen.getByLabelText(/cvv|cvc/i) as HTMLInputElement
      await user.type(cvvInput, '12345')
      
      await waitFor(() => {
        expect(cvvInput.value.length).toBeLessThanOrEqual(4)
      })
    })
  })

  describe('Validaciones del formulario completo', () => {
    it('debe mostrar errores cuando los campos están vacíos', async () => {
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      const submitButton = screen.getByRole('button', { name: /confirmar|pagar/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/número de tarjeta.*requerido/i)).toBeInTheDocument()
      })
    })

    it('debe validar longitud mínima del número de tarjeta (16 dígitos)', async () => {
      const user = userEvent.setup()
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      const cardInput = screen.getByLabelText(/número de tarjeta/i)
      const submitButton = screen.getByRole('button', { name: /confirmar|pagar/i })
      
      await user.type(cardInput, '4111111')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(
          screen.getByText(/número de tarjeta.*incompleto|16 dígitos/i)
        ).toBeInTheDocument()
      })
    })

    it('debe validar que el nombre del titular sea requerido', async () => {
      const user = userEvent.setup()
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      const cardInput = screen.getByLabelText(/número de tarjeta/i)
      await user.type(cardInput, '4111111111111111')
      
      const submitButton = screen.getByRole('button', { name: /confirmar|pagar/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/titular.*requerido/i)).toBeInTheDocument()
      })
    })

    it('debe validar que el CVV tenga al menos 3 dígitos', async () => {
      const user = userEvent.setup()
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      const cvvInput = screen.getByLabelText(/cvv|cvc/i)
      const submitButton = screen.getByRole('button', { name: /confirmar|pagar/i })
      
      await user.type(cvvInput, '12')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/cvv.*3.*dígitos/i)).toBeInTheDocument()
      })
    })
  })

  describe('Interacciones y callbacks', () => {
    it('debe llamar onClose cuando se cierra el modal', () => {
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      const closeButton = screen.getByRole('button', { name: /cerrar|close/i })
      fireEvent.click(closeButton)
      
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('debe guardar los datos en Redux cuando el formulario es válido', async () => {
      const user = userEvent.setup()
      const { store } = renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      // Llenar todos los campos
      await user.type(screen.getByLabelText(/número de tarjeta/i), '4111111111111111')
      await user.type(screen.getByLabelText(/titular/i), 'Juan Perez')
      await user.type(screen.getByLabelText(/fecha de expiración/i), '12/26')
      await user.type(screen.getByLabelText(/cvv|cvc/i), '123')
      
      const submitButton = screen.getByRole('button', { name: /confirmar|pagar/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        const state = store.getState()
        expect(state.cart.paymentInfo).toBeDefined()
        expect(state.cart.paymentInfo?.cardType).toBe('visa')
      })
    })

    it('debe llamar onSubmit después de guardar datos válidos', async () => {
      const user = userEvent.setup()
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      // Llenar todos los campos correctamente
      await user.type(screen.getByLabelText(/número de tarjeta/i), '4111111111111111')
      await user.type(screen.getByLabelText(/titular/i), 'Juan Perez')
      await user.type(screen.getByLabelText(/fecha de expiración/i), '12/26')
      await user.type(screen.getByLabelText(/cvv|cvc/i), '123')
      
      const submitButton = screen.getByRole('button', { name: /confirmar|pagar/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Accesibilidad', () => {
    it('debe tener labels asociados a todos los inputs', () => {
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      expect(screen.getByLabelText(/número de tarjeta/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/titular/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/fecha de expiración/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/cvv|cvc/i)).toBeInTheDocument()
    })

    it('debe poder cerrar con la tecla Escape', () => {
      renderWithStore(
        <CreditCardModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
      )
      
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
      
      expect(mockOnClose).toHaveBeenCalled()
    })
  })
})

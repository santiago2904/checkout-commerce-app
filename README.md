# Checkout Commerce App - Frontend SPA

## 📋 Descripción

Aplicación Single Page Application (SPA) en React para un flujo de checkout conectado a una API de e-commerce con integración a Wompi.

## 🛠️ Stack Tecnológico

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **Estado:** Redux Toolkit (Flux Architecture)
- **Persistencia:** Redux Persist (localStorage)
- **Estilos:** SASS (Mobile-First Design)
- **Testing:** Jest + React Testing Library
- **HTTP Client:** Axios

## 📁 Estructura del Proyecto

```
checkout-commerce-app/
├── src/
│   ├── features/           # Redux slices (Flux pattern)
│   │   ├── auth/          # Autenticación y JWT
│   │   │   └── authSlice.ts
│   │   ├── products/      # Gestión de productos
│   │   │   └── productsSlice.ts
│   │   ├── cart/          # Carrito de compras
│   │   │   └── cartSlice.ts
│   │   └── checkout/      # Proceso de checkout
│   │       └── checkoutSlice.ts
│   │
│   ├── pages/             # Componentes de página
   │   ├── ProductPage/   # Página de productos
   │   │   ├── ProductPage.tsx
   │   │   ├── ProductPage.scss
   │   │   └── ProductPage.test.tsx
   │   └── CheckoutPage/  # Página de checkout
   │       ├── CheckoutPage.tsx
   │       ├── CheckoutPage.scss
   │       └── CheckoutPage.test.tsx
   │
   ├── components/        # Componentes reutilizables
   │   ├── DeliveryForm/  # Formulario de envío
   │   │   ├── DeliveryForm.tsx
   │   │   ├── DeliveryForm.scss
   │   │   └── DeliveryForm.test.tsx
   │   └── CreditCardModal/ # Modal de tarjeta de crédito
   │       ├── CreditCardModal.tsx
   │       ├── CreditCardModal.scss
   │       └── CreditCardModal.test.tsx
│   │
│   ├── store/            # Configuración del Store
│   │   ├── store.ts      # Store + redux-persist
│   │   └── hooks.ts      # Hooks tipados
│   │
│   ├── types/            # TypeScript types
│   │   └── index.ts      # Tipos globales
│   │
│   ├── styles/           # Estilos globales
│   │   └── global.scss
│   │
│   ├── App.tsx           # Componente raíz
│   ├── App.scss
│   ├── main.tsx          # Entry point
│   └── setupTests.ts     # Configuración de tests
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── jest.config.ts
└── README.md
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js >= 18.x
- npm o yarn

### Pasos de instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Ejecutar pruebas
npm test

# 4. Ejecutar pruebas con coverage
npm run test:coverage

# 5. Build para producción
npm run build
```

## ⚙️ Configuración del API

La aplicación se conecta a un backend API para procesar pagos. La URL base del API está configurada en `src/config/api.ts`.

### URL por Defecto

Por defecto, la aplicación apunta a `http://localhost:3000`. Si tu backend API corre en una URL diferente:

**Opción 1: Cambiar directamente en el código**
```typescript
// src/config/api.ts
export const API_CONFIG = {
  baseUrl: 'https://tu-api.com', // Cambia esta URL
  wompiPublicKey: 'pub_stagtest_g2u0HQd3ZMh05hsSgTS2IUV8t3s4mOt7',
  wompiApiUrl: 'https://api-sandbox.co.uat.wompi.dev/v1',
}
```

**Opción 2: Variables de entorno (opcional)**

Crea un archivo `.env` en la raíz del proyecto:
```bash
VITE_CHECKOUT_API_URL=http://localhost:3000
VITE_WOMPI_PUBLIC_KEY=pub_stagtest_g2u0HQd3ZMh05hsSgTS2IUV8t3s4mOt7
```

> **Nota:** Actualmente las variables de entorno están comentadas en el código para compatibilidad con Jest. Si deseas usarlas, actualiza `src/config/api.ts` para leer de `import.meta.env`.

### Endpoints Esperados

El backend debe exponer los siguientes endpoints:

- `POST /api/checkout` - Procesar pago
- `GET /api/checkout/status/:wompiTransactionId` - Consultar estado de transacción
- `GET /api/products` - Obtener listado de productos

## 🛣️ Sistema de Rutas

La aplicación utiliza **React Router v6** para navegación:

| Ruta | Descripción |
|------|-------------|
| `/` | Redirige a `/products` |
| `/products` | Listado de productos disponibles |
| `/checkout` | Flujo de checkout (delivery + payment) |
| `/checkout/summary` | Resumen final (Fase 3) |

### Flujo de Usuario

```
1. ProductPage → Click "Comprar" → Añade al carrito + navega a Checkout
2. CheckoutPage Step 1 → Completa formulario de envío
3. CheckoutPage Step 2 → Ingresa tarjeta de crédito
4. Summary Page → Revisar y confirmar (próximo)
5. Status Page → Polling de transacción (próximo)
```

## 🎯 Fase 1 + 2 - Completadas

### ✅ Fase 1 - Product Page

1. **Estructura de carpetas** siguiendo las mejores prácticas de React
2. **Redux Store configurado** con:
   - Redux Toolkit
   - Redux Persist (resiliencia ante recargas)
   - Arquitectura Flux
   - 4 slices: auth, products, cart, checkout
3. **ProductPage Component**:
   - Integración con Redux
   - Listado de productos
   - Información de stock y precios
   - Botón de compra con navegación
   - Diseño Mobile-First (SASS)
4. **Pruebas TDD completas**:
   - 20+ casos de prueba
   - Configuración apuntando a >80% coverage
   - Testing Library + Jest

### ✅ Fase 2 - Checkout Flow

1. **React Router v6** configurado:
   - Navegación entre ProductPage y CheckoutPage
   - Rutas protegidas (redirige si carrito vacío)
   - Sistema escalable de rutas

2. **CheckoutPage Component**:
   - Step indicators visuales (Envío → Pago → Resumen)
   - Cart summary sidebar con totales
   - Navegación entre pasos
   - Integración completa con Redux
   - Diseño responsive Mobile-First

3. **DeliveryForm Component**:
   - 5 campos validados (nombre, dirección, ciudad, postal, teléfono)
   - Validación en tiempo real
   - Formatos específicos (postal numérico, teléfono 10 dígitos)
   - Precarga de datos desde Redux
   - 50+ casos de prueba TDD

4. **CreditCardModal Component**:
   - Detección automática VISA/MasterCard
   - Formateo de número de tarjeta (espacios cada 4 dígitos)
   - Validación de fecha de expiración (MM/YY)
   - Validación de CVV (3-4 dígitos)
   - Logos visuales según tipo de tarjeta
   - Cierre con tecla Escape
   - 80+ casos de prueba TDD

5. **Algoritmo de Detección de Tarjetas**:
   - VISA: Comienza con 4
   - MasterCard: Rangos 51-55 o 2221-2720
   - Listado de productos
   - Información de stock y precios
   - Botón de compra
   - Diseño Mobile-First (SASS)
4. **Pruebas TDD completas**:
   - 20+ casos de prueba
   - Configuración apuntando a >80% coverage
   - Testing Library + Jest

## 🔌 Integración con Backend

La aplicación espera que el backend esté corriendo en:

```
http://localhost:3000
```

### Endpoints utilizados

- `GET /api/products` - Obtener lista de productos
- `POST /api/auth/login` - Autenticación
- `POST /api/checkout` - Crear transacción (próximamente)
- `GET /api/checkout/status/:id` - Verificar estado (próximamente)

## 📱 Diseño Responsive

Mobile-First siguiendo estos breakpoints:

- **Mobile:** < 600px (base: iPhone SE 2020 - 375px)
- **Tablet:** >= 600px
- **Desktop:** >= 960px

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Modo watch
npm run test:watch

# Con reporte de coverage
npm run test:coverage
```

### Coverage objetivo: >80%

La configuración de Jest está preparada para exigir:
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

## 🔄 Flujo de Negocio (5 Pasos)

### ✅ Fase 1 - Product Page
Muestra productos con stock y permite añadir al carrito.

### ✅ Fase 2 - Credit Card / Delivery Info
Formulario de envío + Modal de tarjeta de crédito con validación.

### Próximas fases:
3. **Summary** (Backdrop con resumen de compra + fees)
4. **Final Status** (Polling cada 5s hasta APPROVED/DECLINED)
5. **Redirect** (Vuelta a productos con stock actualizado)

## 🔐 Persistencia

Gracias a `redux-persist`, se guardan en localStorage:
- Token de autenticación
- Carrito de compras
- Estado del checkout
- Dirección de envío
- Información de pago (temporal)

Esto garantiza que si el usuario recarga la página, no pierda su progreso.

## 🎨 Estilos

- **Metodología:** BEM (Block Element Modifier)
- **Preprocesador:** SASS/SCSS
- **Enfoque:** Mobile-First
- **Variables:** Próximamente en `_variables.scss`

## 📦 Dependencias Principales

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.x",
  "react-redux": "^9.0.4",
  "@reduxjs/toolkit": "^2.0.1",
  "redux-persist": "^6.0.0",
  "axios": "^1.6.2",
  "sass": "^1.69.5"
}
```

## 📝 Notas de Desarrollo

### ProductPage
- Hace dispatch de `fetchProducts()` al montar
- Productos sin stock muestran botón deshabilitado
- Click en "Comprar" añade al carrito y navega a `/checkout`
- Manejo de estados: loading, error, success

### CheckoutPage
- Redirige a `/products` si el carrito está vacío
- Step indicators muestran el progreso (Envío → Pago → Resumen)
- Cart summary sidebar siempre visible con totales
- Navegación back permitida entre pasos

### DeliveryForm
- Validación de campos requeridos
- Formato postal (numérico + guiones)
- Teléfono mínimo 10 dígitos numéricos
- Nombre mínimo 3 caracteres
- Errores se limpian al corregir el campo

### CreditCardModal
- Detecta VISA (inicia con 4) y MasterCard (51-55, 2221-2720)
- Formatea número automáticamente (espacios cada 4 dígitos)
- Valida fecha de expiración no vencida
- CVV 3-4 dígitos
- Cierra con Escape o botón cerrar
- Datos NO se persisten en localStorage (seguridad)

## 🔜 Próximos Pasos

Para continuar con la **Fase 3**, necesitaremos:

1. Página de Summary con backdrop
2. Mostrar desglose: Subtotal + Base Fee + Delivery Fee
3. Botón de confirmar pago
4. Integración con POST /api/checkout
5. Tests TDD para SummaryPage

## 📄 Licencia

Proyecto personal de desarrollo.

---

**Desarrollado con ❤️ usando React + Redux Toolkit**

# Checkout Commerce App - Frontend SPA

## 📋 Descripción

Aplicación Single Page Application (SPA) en React para un flujo de checkout conectado a una API de e-commerce con integración a Wompi.

## 🛠️ Stack Tecnológico

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
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
│   │   └── ProductPage/   # Página de productos
│   │       ├── ProductPage.tsx
│   │       ├── ProductPage.scss
│   │       └── ProductPage.test.tsx
│   │
│   ├── components/        # Componentes reutilizables
│   │   └── (próximamente: Modal, Backdrop, etc.)
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

## 🎯 Fase 1 - Completada

### ✅ Lo implementado

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

### Endpoints utilizados (Fase 1)

- `GET /api/products` - Obtener lista de productos
- `POST /api/auth/login` - Autenticación (preparado para siguiente fase)

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

### Fase 1 ✅ - Product Page
Muestra productos con stock y permite añadir al carrito.

### Próximas fases:
2. **Credit Card / Delivery Info** (Modal + Form)
3. **Summary** (Backdrop con resumen de compra)
4. **Final Status** (Polling de transacción)
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
  "react-redux": "^9.0.4",
  "@reduxjs/toolkit": "^2.0.1",
  "redux-persist": "^6.0.0",
  "axios": "^1.6.2"
}
```

## 📝 Notas de Desarrollo

- El componente ProductPage hace dispatch de `fetchProducts()` al montar
- Los productos sin stock muestran botón deshabilitado
- Advertencia visual cuando el usuario no está autenticado
- Manejo de estados: loading, error, success
- Botón de reintentar en caso de error

## 🔜 Próximos Pasos

Para continuar con la **Fase 2**, necesitaremos:

1. Componente `Modal` para tarjeta de crédito
2. Formulario de dirección de envío
3. Validación de tarjeta (Algoritmo de Luhn)
4. Detección visual del tipo de tarjeta (Visa/MasterCard)
5. Navegación entre pasos

## 📄 Licencia

Proyecto personal de desarrollo.

---

**Desarrollado con ❤️ usando React + Redux Toolkit**

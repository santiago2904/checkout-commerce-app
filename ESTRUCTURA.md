# Estructura de Carpetas del Proyecto - Fase 1

## 📂 Vista Jerárquica Completa

```
checkout-commerce-app/
│
├── 📄 package.json                    # Dependencias y scripts
├── 📄 tsconfig.json                   # Configuración TypeScript
├── 📄 tsconfig.node.json              # Config TS para Node
├── 📄 vite.config.ts                  # Configuración Vite
├── 📄 jest.config.ts                  # Configuración Jest
├── 📄 .gitignore                      # Archivos ignorados por Git
├── 📄 index.html                      # HTML entry point
├── 📄 README.md                       # Documentación del proyecto
│
└── 📁 src/                            # Código fuente
    │
    ├── 📄 main.tsx                    # Entry point de React
    ├── 📄 App.tsx                     # Componente raíz
    ├── 📄 App.scss                    # Estilos del App
    ├── 📄 vite-env.d.ts              # Types de Vite
    ├── 📄 setupTests.ts              # Setup de Jest
    │
    ├── 📁 features/                   # Redux Slices (Flux)
    │   ├── 📁 auth/
    │   │   └── 📄 authSlice.ts       # Estado de autenticación
    │   │
    │   ├── 📁 products/
    │   │   └── 📄 productsSlice.ts   # Estado de productos
    │   │
    │   ├── 📁 cart/
    │   │   └── 📄 cartSlice.ts       # Estado del carrito
    │   │
    │   └── 📁 checkout/
    │       └── 📄 checkoutSlice.ts   # Estado del checkout
    │
    ├── 📁 store/                      # Redux Store
    │   ├── 📄 store.ts               # Config store + persist
    │   └── 📄 hooks.ts               # Hooks tipados (useAppDispatch, useAppSelector)
    │
    ├── 📁 pages/                      # Componentes de página
    │   └── 📁 ProductPage/
    │       ├── 📄 ProductPage.tsx    # Componente principal
    │       ├── 📄 ProductPage.scss   # Estilos (Mobile-First)
    │       └── 📄 ProductPage.test.tsx # Pruebas TDD (>80% coverage)
    │
    ├── 📁 components/                 # Componentes reutilizables
    │   └── (vacío - próximas fases)
    │
    ├── 📁 types/                      # TypeScript types
    │   └── 📄 index.ts               # Tipos globales del proyecto
    │
    └── 📁 styles/                     # Estilos globales
        └── 📄 global.scss            # Reset y utilidades

```

## 📋 Descripción de Cada Elemento

### Archivos de Configuración (Raíz)

| Archivo | Propósito |
|---------|-----------|
| `package.json` | Gestión de dependencias, scripts npm |
| `tsconfig.json` | Configuración de TypeScript para src/ |
| `tsconfig.node.json` | Config TypeScript para archivos de build |
| `vite.config.ts` | Configuración de Vite (alias, plugins, etc.) |
| `jest.config.ts` | Configuración de pruebas, coverage >80% |
| `.gitignore` | Archivos que Git debe ignorar |
| `index.html` | Entry point HTML de la SPA |

### Directorio `src/`

#### 🎯 `/features/` - Redux Slices (Arquitectura Flux)

Cada slice maneja un dominio específico del estado:

- **authSlice.ts**: Login, logout, token JWT, estado de autenticación
- **productsSlice.ts**: Lista de productos, loading, error
- **cartSlice.ts**: Items del carrito, dirección de envío, info de pago
- **checkoutSlice.ts**: Transacción, polling, estado final

#### 🏪 `/store/`

- **store.ts**: Configuración del Redux Store con Redux Persist
- **hooks.ts**: `useAppDispatch()` y `useAppSelector()` tipados

#### 📱 `/pages/`

Componentes que representan páginas completas:

- **ProductPage/**: Primera pantalla del flujo de checkout
  - Componente TSX
  - Estilos SCSS (Mobile-First)
  - Archivo de pruebas (TDD)

#### 🧩 `/components/`

Componentes reutilizables (próximas fases):
- Modal (para tarjeta de crédito)
- Backdrop (para resumen)
- Forms, Buttons, etc.

#### 📘 `/types/`

Interfaces y tipos TypeScript compartidos:
- Product, CartItem, ShippingAddress
- CreditCard, CheckoutRequest/Response
- Estados de Redux (AuthState, ProductsState, etc.)

#### 🎨 `/styles/`

- **global.scss**: Reset CSS, estilos base, utilidades

## 🔑 Principios de Organización

### 1. **Separación por Features (Flux/Redux)**
Cada slice tiene su propio archivo en `/features/`, siguiendo el patrón de Redux Toolkit.

### 2. **Colocation**
Cada componente de página tiene sus estilos y tests en la misma carpeta.

### 3. **Tipos Centralizados**
Los tipos compartidos están en `/types/` para evitar importaciones circulares.

### 4. **Configuración Centralizada**
El store y la configuración de persistencia están en `/store/`.

### 5. **Mobile-First**
Todos los estilos SCSS siguen el enfoque Mobile-First (base: 375px).

## 📊 Métricas de la Fase 1

- **Archivos TypeScript/TSX**: 14
- **Archivos SCSS**: 3
- **Archivos de configuración**: 6
- **Tests**: 1 archivo con 20+ casos de prueba
- **Slices de Redux**: 4
- **Páginas implementadas**: 1 de 5

## 🔄 Próximas Adiciones

En las siguientes fases se agregarán:

```
src/
├── pages/
│   ├── DeliveryPage/
│   ├── SummaryPage/
│   └── StatusPage/
│
├── components/
│   ├── Modal/
│   ├── Backdrop/
│   ├── CreditCardForm/
│   └── DeliveryForm/
│
└── services/
    └── api.ts (opcional, si abstraemos más las llamadas)
```

## 💡 Notas de Arquitectura

1. **Redux Persist** guarda automáticamente en `localStorage`:
   - auth (token)
   - cart (items, dirección, pago)
   - checkout (transacción)

2. **products** NO se persiste (queremos datos frescos)

3. **Cada slice es independiente** y puede despacharse desde cualquier componente

4. **Los tests están colocados** junto a sus componentes (`*.test.tsx`)

---

**Esta estructura escalable está lista para las 4 fases restantes del proyecto.**

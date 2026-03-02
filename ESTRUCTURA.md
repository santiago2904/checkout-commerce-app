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
    │   ├── 📁 ProductPage/
    │   │   ├── 📄 ProductPage.tsx    # Listado de productos
    │   │   ├── 📄 ProductPage.scss   # Estilos (Mobile-First)
    │   │   └── 📄 ProductPage.test.tsx # Pruebas TDD (>80% coverage)
    │   │
    │   └── 📁 CheckoutPage/
    │       ├── 📄 CheckoutPage.tsx   # Flujo de checkout con steps
    │       ├── 📄 CheckoutPage.scss  # Estilos responsive
    │       └── 📄 CheckoutPage.test.tsx # Pruebas TDD
    │
    ├── 📁 components/                 # Componentes reutilizables
    │   ├── 📁 DeliveryForm/
    │   │   ├── 📄 DeliveryForm.tsx   # Formulario de envío
    │   │   ├── 📄 DeliveryForm.scss  # Estilos Mobile-First
    │   │   └── 📄 DeliveryForm.test.tsx # Pruebas TDD (50+ casos)
    │   │
    │   └── 📁 CreditCardModal/
    │       ├── 📄 CreditCardModal.tsx # Modal de pago con detección VISA/MC
    │       ├── 📄 CreditCardModal.scss # Estilos responsive
    │       └── 📄 CreditCardModal.test.tsx # Pruebas TDD (80+ casos)
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

Componentes reutilizables:
- **DeliveryForm/**: Formulario de dirección de envío con validación
- **CreditCardModal/**: Modal de pago con detección VISA/MasterCard
- Próximos: Backdrop (resumen), Loader, etc.

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

## 📊 Métricas del Proyecto (Fase 1 + 2 Completas)

- **Archivos TypeScript/TSX**: 23
- **Archivos SCSS**: 6
- **Archivos de configuración**: 6
- **Tests**: 3 archivos con 150+ casos de prueba totales
- **Slices de Redux**: 4
- **Páginas implementadas**: 2 (ProductPage, CheckoutPage)
- **Componentes reutilizables**: 2 (DeliveryForm, CreditCardModal)
- **Rutas configuradas**: 5

## �️ Sistema de Rutas (React Router)

El proyecto utiliza **React Router v6** para navegación entre páginas:

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | Redirect → `/products` | Ruta raíz redirige a productos |
| `/products` | `ProductPage` | Listado de productos disponibles |
| `/checkout` | `CheckoutPage` | Flujo de checkout (delivery + payment) |
| `/checkout/summary` | Summary Page | Resumen final antes de pagar (Fase 3) |
| `*` | Redirect → `/products` | Rutas no encontradas redirigen a inicio |

### Flujo de Navegación

```
ProductPage (click "Comprar")
    ↓
CheckoutPage - Step 1: Delivery Form
    ↓ (completar formulario)
CheckoutPage - Step 2: Credit Card Modal
    ↓ (guardar tarjeta)
/checkout/summary - Summary Backdrop (Fase 3)
    ↓ (confirmar pago)
Status Page con Polling (Fase 4)
    ↓ (APPROVED/DECLINED)
Redirect a ProductPage (Fase 5)
```

### Características del Router

- **BrowserRouter** configurado en `App.tsx`
- **useNavigate()** hook para navegación programática
- **Protección de rutas**: CheckoutPage redirige si carrito vacío
- **Persistencia**: Redux Persist mantiene el estado entre navegaciones

## 🔄 Próximas Adiciones

En la Fase 3 se agregará:

```
src/
├── pages/
│   └── SummaryPage/         # Resumen con backdrop
│
└── components/
    └── Backdrop/            # Componente de backdrop reutilizable
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

import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from '@/features/auth/authSlice'
import productsReducer from '@/features/products/productsSlice'
import cartReducer from '@/features/cart/cartSlice'
import checkoutReducer from '@/features/checkout/checkoutSlice'

// Configuración de redux-persist
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // Especificamos qué slices queremos persistir
  whitelist: ['auth', 'cart', 'checkout'],
  // No persistimos products porque queremos datos frescos en cada sesión
}

// Combinamos todos los reducers
const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
})

// Creamos el reducer persistido
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Configuramos el store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignoramos estas acciones de redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

// Creamos el persistor
export const persistor = persistStore(store)

// Tipos para TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

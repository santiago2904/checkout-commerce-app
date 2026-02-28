# Contexto del Proyecto: Frontend SPA Checkout Wompi

Actúa como un Desarrollador Frontend Senior experto en ReactJS y Arquitectura de UI. Necesito construir el frontend (Single Page Application) para un flujo de *checkout* conectado a una API de e-commerce que ya he construido.

Debemos aplicar estrictamente las siguientes reglas y requerimientos:

## 1. Stack Tecnológico y Arquitectura
* **Framework:** ReactJS (inicializado con Vite para ser estrictamente SPA). NO usar Next.js ni otros meta-frameworks.
* **Manejo de Estado (Obligatorio):** Redux Toolkit siguiendo la arquitectura Flux. 
* **Persistencia (Obligatorio):** La aplicación debe ser resiliente. El progreso del cliente (carrito, datos de envío, estado de la transacción) debe guardarse en `localStorage` (puedes usar `redux-persist`) para que se recupere en caso de que el usuario recargue la página.
* **Estilos:** Mobile-First Design. Es obligatorio que la UI se adapte perfectamente a pantallas móviles (Referencia mínima: iPhone SE 2020). Utiliza Flexbox, podemos usar SASS
* **Pruebas (TDD):** Uso estricto de Jest y React Testing Library. Debes generar las pruebas garantizando **más del 80% de coverage**.

## 2. Flujo de Negocio (5 Pasos Obligatorios)
La aplicación debe seguir exactamente este flujo de 5 pantallas/estados:

1. **Product Page:** Llama a `GET /api/products` y muestra los productos y las unidades disponibles en stock (con descripción y precio). Añade un botón "Comprar".
2. **Credit Card / Delivery Info:** * Formulario de datos de envío (`shippingAddress`).
   * Botón "Pay with credit card" que abre un **Modal** solicitando la info de la tarjeta.
   * *Plus Requerido:* Detección visual del logo de la tarjeta (MasterCard o VISA) según el número ingresado. Los datos de la tarjeta deben seguir la estructura real (Algoritmo de Luhn/Regex) aunque sean falsos.
3. **Summary (Resumen):** Muestra el desglose: Monto del producto + Base fee (fijo) + Delivery Fee. Este resumen debe mostrarse en un componente de tipo **Backdrop** (referencia Material UI Backdrop) que incluya el botón final de "Pagar".
4. **Final Status:** * Al hacer clic en pagar, llama a `POST /api/checkout`. 
   * Como la API de Wompi es asíncrona y devuelve un estado `PENDING`, debes implementar un **Polling** que llame a `GET /api/checkout/status/:transactionId` cada 5 segundos hasta que el estado cambie a `APPROVED` o `DECLINED`. Muestra un loader o UI de procesamiento mientras tanto.
   * Muestra el resultado final de la transacción de forma visualmente clara (Éxito o Fallo).
5. **Redirect to Product Page:** Un botón para volver a la página de productos, donde se debe reflejar el stock actualizado (volviendo a llamar a `GET /api/products`).

## 3. Integración con el Backend
Asume que el backend corre en `http://localhost:3000`. 
*Nota: El backend requiere un token JWT para el checkout. Debes implementar un flujo "silencioso" o una pantalla inicial rápida de Login/Register (`POST /api/auth/login`) para guardar el token en el state/localStorage antes de iniciar el flujo de compra.*

## Instrucciones de Generación Iterativa (Fase 1)
Para mantener el orden, aplicar TDD correctamente y no saturar el contexto, entrégame **únicamente** lo siguiente en tu primera respuesta:
1. La estructura de carpetas sugerida para React (separando `components`, `features/redux`, `pages`, `services`).
2. La configuración inicial del Store de Redux (`store.ts`) incluyendo la configuración de `redux-persist` para cumplir la regla de resiliencia.
3. El código del componente de la primera pantalla (**Product Page**) junto con su archivo de prueba de Jest (`ProductPage.test.tsx`) fallido inicialmente (TDD).
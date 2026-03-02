/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHECKOUT_API_URL?: string
  readonly VITE_WOMPI_PUBLIC_KEY?: string
  readonly VITE_WOMPI_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

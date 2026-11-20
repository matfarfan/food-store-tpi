/// <reference types="vite/client" />

// Tipado de las variables de entorno de Vite (import.meta.env)
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

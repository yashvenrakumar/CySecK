/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend origin (no trailing slash), e.g. http://localhost:4000 */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

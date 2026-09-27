/// <reference types="vite/client" />

// The build-time variables the app reads (see .env.example).
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_ENABLE_DEBUG_TOOLS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

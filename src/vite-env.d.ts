/// <reference types="vite/client" />

// The build-time variables the app reads (see .env.example).
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_ENABLE_DEBUG_TOOLS?: string;
}

// Written by the bundler (`define` in vite.config.js); absent under Node.
declare const __CP_DEBUG_BUILD__: boolean;
declare const __CP_SERVICE_WORKER__: "on" | "ask" | "off";

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

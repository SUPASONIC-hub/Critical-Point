/// <reference types="vite/client" />

// The build-time variables the app reads (see .env.example).
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_ENABLE_DEBUG_TOOLS?: string;
  // 주 1회 알림 (N25): the Web Push public key; without it the switch is not offered.
  readonly VITE_VAPID_PUBLIC_KEY?: string;
}

// Written by the bundler (`define` in vite.config.js); absent under Node.
declare const __CP_DEBUG_BUILD__: boolean;
declare const __CP_SERVICE_WORKER__: "on" | "ask" | "off";
declare const __CP_COLD_OPENING__: boolean;

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

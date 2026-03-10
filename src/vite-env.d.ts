/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TRTC_SDK_APP_ID: string;
  readonly VITE_TRTC_SDK_SECRET_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

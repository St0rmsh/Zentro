/// <reference types="vite-plugin-pwa/client" />

import { registerSW } from "virtual:pwa-register";

export const updateServiceWorker = registerSW({
  immediate: true,
  onOfflineReady() {
    window.dispatchEvent(new Event("pwa:offline-ready"));
  },
  onNeedRefresh() {
    window.dispatchEvent(new Event("pwa:update-available"));
  },
});

import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

const isCapacitor = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();
const serverUrl = isCapacitor ? 'https://api.base44.io' : '';

// On Capacitor, defer realtime init until the native platform is fully ready
// to avoid WebSocket TransportError on iOS WebView before DOM/network is ready.
let realtimeEnabled = true;
if (isCapacitor) {
  realtimeEnabled = false; // start disabled, re-enable after deviceready
}

export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl,
  requiresAuth: false,
  appBaseUrl,
  realtimeEnabled,
});

// On Capacitor, wait for deviceready then enable realtime
if (isCapacitor) {
  const enableRealtime = () => {
    try {
      base44.realtime?.connect?.();
    } catch (e) {
      console.warn('[base44] realtime connect failed:', e);
    }
  };
  if (document.readyState === 'complete') {
    // Already ready — short delay to let Capacitor network stack settle
    setTimeout(enableRealtime, 500);
  } else {
    document.addEventListener('deviceready', enableRealtime, { once: true });
    // Fallback: also try on DOMContentLoaded + delay
    document.addEventListener('DOMContentLoaded', () => setTimeout(enableRealtime, 500), { once: true });
  }
}
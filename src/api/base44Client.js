import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

const isCapacitor = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();

export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  // On web: empty string resolves to current origin (correct).
  // On Capacitor: omit serverUrl so SDK uses its default https://base44.app.
  ...(isCapacitor ? {} : { serverUrl: '' }),
  requiresAuth: false,
  appBaseUrl,
  // Disable Socket.IO realtime on Capacitor — the app does not use realtime
  // subscriptions and the WebSocket handshake fails on iOS WebView.
  realtimeEnabled: !isCapacitor,
});
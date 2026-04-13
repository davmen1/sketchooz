import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// On Capacitor, relative URLs resolve to ws://capacitor — use absolute server URL instead
const isCapacitor = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();
const serverUrl = isCapacitor ? 'https://api.base44.io' : '';

//Create a client with authentication required
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl,
  requiresAuth: false,
  appBaseUrl,
  // Disable WebSocket realtime on Capacitor to prevent infinite connect_error loop
  realtimeEnabled: !isCapacitor,
});
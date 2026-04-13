import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// On Capacitor, relative URLs resolve to ws://capacitor — use absolute server URL instead
const isCapacitor = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();
// Always use the public HTTPS base44 server (never localhost or relative URLs on native)
const serverUrl = isCapacitor ? 'https://api.base44.io' : '';

//Create a client with authentication required
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl,
  requiresAuth: false,
  appBaseUrl,
  realtimeEnabled: true,
});
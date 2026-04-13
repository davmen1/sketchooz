import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// On native Capacitor, relative/empty serverUrl resolves to "capacitor://" which breaks
// Socket.IO polling. The SDK default is "https://base44.app" — let it use that by omitting
// serverUrl entirely on native. On web, keep empty string (resolves to current origin).
const isCapacitor = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();

export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  ...(isCapacitor ? {} : { serverUrl: '' }),
  requiresAuth: false,
  appBaseUrl,
});

if (isCapacitor) {
  console.log('[base44] Capacitor native — using SDK default serverUrl (https://base44.app)');
}
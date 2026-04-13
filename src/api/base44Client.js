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

// On Capacitor, wait for deviceready then enable realtime with full diagnostics
if (isCapacitor) {
  let realtimeConnectAttempted = false;

  const enableRealtime = () => {
    if (realtimeConnectAttempted) {
      console.warn('[base44:realtime] connect already attempted — skipping double init');
      return;
    }
    realtimeConnectAttempted = true;

    const rt = base44.realtime;
    console.log('[base44:realtime] enableRealtime called', {
      readyState: document.readyState,
      hasRealtime: !!rt,
      realtimeKeys: rt ? Object.keys(rt) : [],
    });

    if (!rt) {
      console.warn('[base44:realtime] no realtime object on client — skipping');
      return;
    }

    // Attach socket-level diagnostics if socket is accessible
    const attachDiagnostics = (socket) => {
      if (!socket) return;
      console.log('[base44:realtime] socket found', {
        id: socket.id,
        connected: socket.connected,
        transport: socket.io?.engine?.transport?.name,
      });

      socket.on('connect', () => {
        console.log('[base44:realtime] ✅ connected', {
          id: socket.id,
          transport: socket.io?.engine?.transport?.name,
        });
      });

      socket.on('connect_error', (err) => {
        console.error('[base44:realtime] ❌ connect_error', {
          message: err?.message,
          description: err?.description,
          context: err?.context,
          transport: socket.io?.engine?.transport?.name,
        });
      });

      socket.on('disconnect', (reason) => {
        console.warn('[base44:realtime] disconnect', reason);
      });

      socket.io?.engine?.on('upgrade', (transport) => {
        console.log('[base44:realtime] transport upgraded to', transport?.name);
      });

      socket.io?.engine?.on('upgradeError', (err) => {
        console.error('[base44:realtime] transport upgrade failed', err?.message);
      });
    };

    try {
      rt.connect?.();
      // Try to attach diagnostics to the underlying socket after a tick
      setTimeout(() => {
        const socket = rt.socket || rt._socket || rt.io;
        attachDiagnostics(socket);
      }, 200);
    } catch (e) {
      console.error('[base44:realtime] connect() threw', e?.message, e);
    }
  };

  if (document.readyState === 'complete') {
    setTimeout(enableRealtime, 500);
  } else {
    document.addEventListener('deviceready', enableRealtime, { once: true });
    document.addEventListener('DOMContentLoaded', () => setTimeout(enableRealtime, 500), { once: true });
  }
}
/**
 * Returns true if the app is running inside an iOS/iPadOS webview or on any mobile/tablet device.
 * On desktop web browsers → false (show Plans/Pricing).
 * On iPhone, iPad (any Safari or webview), Android → true (show Info/BusinessFeatures).
 */
export const isMobileOrTabletApp = () => {
  if (typeof window === 'undefined') return false;

  const ua = navigator.userAgent || '';

  // iOS devices (iPhone, iPod, older iPad)
  if (/iPhone|iPod/.test(ua)) return true;

  // iPad explicit UA
  if (/iPad/.test(ua)) return true;

  // iPadOS 13+ with "Request Desktop Site" — UA says Macintosh but has multi-touch
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return true;

  // Android phones/tablets
  if (/Android/.test(ua)) return true;

  // Generic mobile
  if (/Mobile|Tablet/.test(ua)) return true;

  // WKWebView / Capacitor / Cordova webview signals
  if (window.webkit && window.webkit.messageHandlers) return true;

  return false;
};
/**
 * Returns true ONLY if the app is running inside a native WebView (iOS/Android app).
 * Regular mobile browsers (Safari, Chrome on iPhone/iPad) → false.
 * Only native app WebViews → true.
 */
export const isMobileOrTabletApp = () => {
  if (typeof window === 'undefined') return false;

  // WKWebView / Capacitor / Cordova webview signals
  if (window.webkit && window.webkit.messageHandlers) return true;

  // Capacitor native app
  if (window.Capacitor && window.Capacitor.isNative) return true;

  // Cordova
  if (window.cordova) return true;

  return false;
};
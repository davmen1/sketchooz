/**
 * Returns true ONLY if the app is running inside a native WebView (iOS/Android app).
 * Regular mobile browsers (Safari, Chrome on iPhone/iPad) → false.
 * Only native app WebViews → true.
 */
export const isMobileOrTabletApp = () => {
  if (typeof window === 'undefined') return false;

  const ua = navigator.userAgent || '';
  // Known mobile browsers — these are NOT native WebViews
  const isKnownBrowser = /CriOS|FxiOS|OPiOS|EdgiOS|Chrome|Firefox|Safari/i.test(ua);

  // WKWebView on iOS: native apps do NOT expose standard browser identifiers
  if (window.webkit && window.webkit.messageHandlers && !isKnownBrowser) return true;

  // Capacitor native app
  if (window.Capacitor && window.Capacitor.isNative) return true;

  // Cordova
  if (window.cordova) return true;

  return false;
};
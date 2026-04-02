export const isIOSWebView = () => {
  const ua = navigator.userAgent || '';
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  const hasWebKit = typeof window !== 'undefined' && !!(window.webkit?.messageHandlers);
  const notSafari = isIOS && !ua.includes('Safari');
  return isIOS && (hasWebKit || notSafari);
};
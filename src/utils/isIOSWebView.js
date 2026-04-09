export const isIOS = () => {
  const ua = navigator.userAgent || '';
  // Standard iPhone/iPod/iPad detection
  if (/iPhone|iPad|iPod/.test(ua)) return true;
  // iPadOS 13+ with "Request Desktop Site" enabled reports as MacIntel
  // but still has touch support
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return true;
  return false;
};

export const isIOSWebView = () => {
  const ua = navigator.userAgent || '';
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  const hasWebKit = typeof window !== 'undefined' && !!(window.webkit?.messageHandlers);
  const notSafari = isIOS && !ua.includes('Safari');
  return isIOS && (hasWebKit || notSafari);
};
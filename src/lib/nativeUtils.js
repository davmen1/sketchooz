// Haptic feedback
export function vibrate(pattern = 10) {
  try { navigator.vibrate?.(pattern); } catch {}
}

// Offline gallery (last 10 renders)
const GALLERY_KEY = 'sketchooz_gallery';

export function saveToGallery(url) {
  try {
    const items = JSON.parse(localStorage.getItem(GALLERY_KEY) || '[]');
    // avoid duplicates
    const filtered = items.filter(i => i.url !== url);
    filtered.unshift({ url, timestamp: Date.now() });
    localStorage.setItem(GALLERY_KEY, JSON.stringify(filtered.slice(0, 10)));
  } catch {}
}

export function getGallery() {
  try {
    return JSON.parse(localStorage.getItem(GALLERY_KEY) || '[]');
  } catch {
    return [];
  }
}
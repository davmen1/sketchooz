import React, { createContext, useContext, useState } from 'react';

const LangContext = createContext();

export const translations = {
  it: {
    appSubtitle: 'Industrial Design AI',
    heroTitle: 'Da idea a sketch',
    heroTitleAccent: 'professionale',
    heroDesc: 'Carica una foto, un disegno o una bozza e trasformalo in uno sketch di industrial design con colori Pantone.',
    restart: 'Ricomincia',
    settings: 'Impostazioni',
    settingsDesc: 'Personalizza il risultato',
    generate: 'Genera Sketch',
    generating: 'Generazione...',
    output: 'Output',
    singleView: 'Vista Singola',
    studySheet: 'Tavola Studio',
    view: 'Vista',
    board: 'Tavola',
    style: 'Stile',
    surface: 'Superficie',
    detail: 'Dettaglio',
    finishing: 'Finishing',
    texture: 'Texture',
    cleanDesign: 'Design Pulito',
    cleanDesignDesc: 'Nessuna quota, annotazione o dimensione',
    suggestPalette: 'Suggerisci Palette',
    suggestingPalette: 'Analisi...',
    suggestPaletteHint: 'Analizza i colori dal tuo prodotto',
    result: 'Risultato',
    compare: 'Confronta',
    original: 'Originale',
    sketch: 'Sketch',
    vectorDownload: 'Vector .SVG',
    vectorWarning: '⏳ La generazione del file SVG vettoriale può richiedere 30–90 secondi a seconda della complessità dell\'immagine. Procedere?',
    vectorGenerating: 'Vettorizzando…',
    vectorError: 'Generazione vettore fallita. Riprova.',
    download: 'Download',
    markerBgNote: 'Splash di marker grezzo dietro il prodotto · bordi bold nero + bianco',
    textureComboNote: 'Combo: {t1} + {t2} — l\'AI distribuirà le texture intelligentemente',
    selected: 'selezionati',
    freeLimit: 'Limite raggiunto: 1 render gratuito al giorno (max 10/mese). Acquista crediti per continuare.',
    watermarkBanner: 'Render gratuito — con watermark. Acquista crediti per esportare senza.',
    upgrade: 'Acquista crediti',
    promoActive: 'Promo attiva',
    promoExpiry: 'Scade 23 apr 2026',
    promoRendersLeft: 'render rimasti',
    promoExhausted: 'Hai esaurito i render promo.',
    promoApplied: '✅ Codice promo applicato! Hai 6 crediti (2 render) senza watermark.',
    promoInvalid: '❌ Codice promo non valido.',
    promoPrompt: 'Inserisci il codice promo:',
    promoLink: 'Hai un codice promo?',
    correctionsLabel: 'Correggi il Design',
    correctionsPlaceholder: 'Es: rendi i bordi più netti, usa toni più caldi...',
    correctionsApply: 'Applica correzione',
    correctionsNote: 'Verranno scalati 3 crediti dal tuo saldo. Il render verrà rigenerato con le tue istruzioni.',
    // Tabs
    tabHome: 'Home',
    tabPlans: 'Piani',
    tabSettings: 'Impostazioni',
    // Pricing page
    pricingTitle: 'Crediti',
    pricingSubtitle: 'Pacchetti senza abbonamento',
    freeTierDesc: '🎨 Piano Gratuito — 1 render gratuito al giorno con filigrana (max 10/mese)',
  },
  en: {
    appSubtitle: 'Industrial Design AI',
    heroTitle: 'From idea to sketch',
    heroTitleAccent: 'professional',
    heroDesc: 'Upload a photo, drawing or rough idea and transform it into an industrial design sketch with Pantone colors.',
    restart: 'Restart',
    settings: 'Settings',
    settingsDesc: 'Customize the result',
    generate: 'Generate Sketch',
    generating: 'Generating...',
    output: 'Output',
    singleView: 'Single View',
    studySheet: 'Study Sheet',
    view: 'View',
    board: 'Layout',
    style: 'Style',
    surface: 'Surface',
    detail: 'Detail',
    finishing: 'Finishing',
    texture: 'Texture',
    cleanDesign: 'Clean Design',
    cleanDesignDesc: 'No quotes, annotations, or dimension labels',
    suggestPalette: 'Suggest Palette',
    suggestingPalette: 'Analyzing...',
    suggestPaletteHint: 'Analyze colors from your product image',
    result: 'Result',
    compare: 'Compare',
    original: 'Original',
    sketch: 'Sketch',
    vectorDownload: 'Vector .SVG',
    vectorWarning: '⏳ Generating an SVG vector file may take 30–90 seconds depending on image complexity. Proceed?',
    vectorGenerating: 'Vectorizing…',
    vectorError: 'Vector generation failed. Please try again.',
    download: 'Download',
    markerBgNote: 'Raw marker color splash behind the object · bold black + white boundary lines',
    textureComboNote: 'Combo: {t1} + {t2} — AI will intelligently blend both textures',
    selected: 'selected',
    freeLimit: 'Limit reached: 1 free render per day (max 10/month). Buy credits to continue.',
    watermarkBanner: 'Free render — watermarked. Buy credits for clean exports.',
    upgrade: 'Buy credits',
    promoActive: 'Promo active',
    promoExpiry: 'Expires Apr 23 2026',
    promoRendersLeft: 'renders left',
    promoExhausted: 'You have used all your promo renders.',
    promoApplied: '✅ Promo code applied! You have 6 credits (2 renders) watermark-free.',
    promoInvalid: '❌ Invalid promo code.',
    promoPrompt: 'Enter promo code:',
    promoLink: 'Have a promo code?',
    correctionsLabel: 'Correct the Design',
    correctionsPlaceholder: 'E.g. sharper edges, warmer tones, more detail on handles...',
    correctionsApply: 'Apply correction',
    correctionsNote: '3 credits will be deducted. The render will be regenerated with your instructions.',
    // Tabs
    tabHome: 'Home',
    tabPlans: 'Plans',
    tabSettings: 'Settings',
    // Pricing page
    pricingTitle: 'Credits',
    pricingSubtitle: 'No subscription — pay as you go',
  },
};

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('sf_lang') || 'it');
  const toggle = () => {
    const next = lang === 'it' ? 'en' : 'it';
    localStorage.setItem('sf_lang', next);
    setLang(next);
  };
  const t = (key) => translations[lang][key] || key;
  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
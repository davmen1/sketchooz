import React, { createContext, useContext, useState } from 'react';

const LangContext = createContext();

export const translations = {
  it: {
    appSubtitle: 'Industrial Design AI',
    heroTitle: 'Da idea a sketch',
    heroTitleAccent: 'professionale',
    heroDesc: 'Sketchooz è uno strumento AI per industrial designer: carica la foto di un prodotto e ottieni in secondi uno sketch professionale con colori Pantone, diverse prospettive e stili grafici.',
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
    colorful: 'Pieno',
    splash: 'Splash',
    noBackground: 'Nessuno',
    background: 'Sfondo',
    markerBg: 'Marker BG',
    markerBgDesc: 'Contorni audaci + highlights bianchi + splash marker dietro',
    splashBgColor: 'Colore Sfondo Splash',
    markerBgNote: 'Splash grezzo di marker colorato dietro al prodotto · sfondo resto bianco',
    splashBgColorHint: 'Scegli il colore del marker splash',
    splashColorDefault: 'Pantone automatico (contrasto)',
    selected: 'selezionati',
    freeLimit: 'Crediti esauriti. Acquista un pacchetto per continuare.',
    upgrade: 'Acquista crediti',
    promoActive: 'Promo attiva',
    promoExpiry: 'Scade 23 apr 2026',
    promoRendersLeft: 'render rimasti',
    promoExhausted: 'Hai esaurito i render promo.',
    promoApplied: '✅ Codice promo applicato! Hai 6 crediti (2 render) senza watermark.',
    promoInvalid: '❌ Codice promo non valido.',
    promoPrompt: 'Inserisci il codice promo:',
    promoLink: 'Hai un codice promo?',
    generatingToast: '⏳ Sono necessari alcuni secondi per generare il tuo sketch…',
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
    // Sketch styles
    markerRenderDesc: 'Rendering colorato a marker',
    bwLinesDesc: 'Schizzo b/w per rasterizzazione',
    // Modes
    preciseMode: 'Preciso',
    creativeMode: 'Creativo',
    preciseModeDesc: "Massima fedeltà all'originale",
    creativeModeDesc: 'Più libero e interpretativo',
    // Tech sheet
    techSheetNote: 'Le tavole tecniche usano sempre la modalità Preciso per la massima accuratezza.',
    // Texture
    textureComboNote: 'Verrà applicata una combinazione di {t1} e {t2}.',
  },
  en: {
    appSubtitle: 'Industrial Design AI',
    heroTitle: 'From idea to sketch',
    heroTitleAccent: 'professional',
    heroDesc: 'Sketchooz is an AI tool for industrial designers: upload a product photo and get a professional sketch in seconds — with Pantone colors, multiple perspectives and graphic styles.',
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
    colorful: 'Solid',
    splash: 'Splash',
    noBackground: 'None',
    background: 'Background',
    markerBg: 'Marker BG',
    markerBgDesc: 'Bold outlines + white highlights + marker splash behind',
    splashBgColor: 'Splash Background Color',
    markerBgNote: 'Raw colored marker splash behind the product · rest of background stays white',
    splashBgColorHint: 'Choose the marker splash color',
    splashColorDefault: 'Auto Pantone (contrast)',
    selected: 'selected',
    freeLimit: 'No credits left. Buy a pack to continue.',
    upgrade: 'Buy credits',
    promoActive: 'Promo active',
    promoExpiry: 'Expires Apr 23 2026',
    promoRendersLeft: 'renders left',
    promoExhausted: 'You have used all your promo renders.',
    promoApplied: '✅ Promo code applied! You have 6 credits (2 renders) watermark-free.',
    promoInvalid: '❌ Invalid promo code.',
    promoPrompt: 'Enter promo code:',
    promoLink: 'Have a promo code?',
    generatingToast: '⏳ A few seconds are required to generate your sketch…',
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
    // Sketch styles
    markerRenderDesc: 'Colored marker rendering',
    bwLinesDesc: 'B/W sketch for rasterization',
    // Modes
    preciseMode: 'Precise',
    creativeMode: 'Creative',
    preciseModeDesc: 'Maximum fidelity to the original',
    creativeModeDesc: 'More free and interpretive',
    // Tech sheet
    techSheetNote: 'Technical sheets always use Precise mode for maximum accuracy.',
    // Texture
    textureComboNote: 'A combination of {t1} and {t2} will be applied.',
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
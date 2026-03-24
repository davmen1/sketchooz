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
    vectorDownload: 'Vector €0,99',
    download: 'Download',
    markerBgNote: 'Splash di marker grezzo dietro il prodotto · bordi bold nero + bianco',
    textureComboNote: 'Combo: {t1} + {t2} — l\'AI distribuirà le texture intelligentemente',
    selected: 'selezionati',
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
    vectorDownload: 'Vector €0.99',
    download: 'Download',
    markerBgNote: 'Raw marker color splash behind the object · bold black + white boundary lines',
    textureComboNote: 'Combo: {t1} + {t2} — AI will intelligently blend both textures',
    selected: 'selected',
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
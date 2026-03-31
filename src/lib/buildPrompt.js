export const STYLE_LABELS = {
  marker_render: 'hand-drawn industrial design marker sketch — pencil underdrawing with confident construction lines visible, then filled with Copic/Pantone alcohol markers using smooth flat tones, bold gradient transitions, sharp specular white highlights on edges, and a thick black fineliner outline around the silhouette. Style: professional ID sketchbook, Copic marker on white paper',  
  bw_lines: 'clean black and white line drawing with precise confident strokes, no color fills, no shading, only black lines on white paper',
  pencil_sketch: 'detailed graphite pencil sketch with fine hatching',
  ballpoint_pen: 'ballpoint pen sketch with confident line work',
  technical_drawing: 'precise technical drawing with clean construction lines',
  watercolor_sketch: 'watercolor rendering with loose expressive washes',
};

export const PERSPECTIVE_LABELS = {
  keep_original: 'maintaining the original perspective and angle',
  three_quarter: 'in a dynamic three-quarter perspective view',
  perspective: 'in a natural perspective view with vanishing points',
  isometric: 'in an isometric axonometric projection',
  front_eu: 'as a clean front elevation (European first-angle projection)',
  back_eu: 'as a clean back elevation',
  left_eu: 'as a left-side elevation',
  right_eu: 'as a right-side elevation',
  top_eu: 'as a top plan view',
  bottom_eu: 'as a bottom plan view',
};

export const STUDY_SHEET_LABELS = {
  four_views_eu: 'a professional 4-view orthographic study sheet in European first-angle projection (Front elevation top-left, Side elevation top-right, Top plan bottom-left, Back elevation bottom-right) arranged on a single white sheet with thin border lines separating the views and projection labels in small caps',
  four_views_us: 'a professional 4-view orthographic study sheet in US third-angle projection (Front view top-left, Right side view top-right, Top view bottom-left, Perspective/isometric view bottom-right) arranged on a single white sheet',
  six_views: 'a complete 6-view orthographic study sheet showing Front, Back, Left, Right, Top, and Bottom elevations arranged in a cross layout on a single white sheet',
  multi_angle: 'a multi-angle study sheet showing the object from 6 different viewpoints: three-quarter front-left, three-quarter front-right, front, back, three-quarter back, and top — arranged in a 2x3 grid on a single white sheet',
  cross_section: 'a technical cross-section study sheet showing 2–3 key sectional cuts through the object, with hatching on cut surfaces, internal components visible, and section markers on a plan view — all on a single white sheet',
  exploded: 'a professional exploded-view illustration showing all components separated along their assembly axes with thin leader lines indicating assembly order, on a white sheet',
  detail_focus: 'a detail-focus study sheet with one main three-quarter view large in the center and 3–4 zoomed detail callouts around it showing joints, textures, and key features — no text labels, only visual detail circles',
  ideation_sheet: "an ideation study sheet with 6–8 quick concept sketches of the same product at different stages of refinement, arranged loosely on a white sheet like a real designer's sketchbook page",
};

export const SURFACE_LABELS = {
  matte: 'matte surface finishes with subtle light diffusion',
  glossy: 'high-gloss reflective surfaces with sharp specular highlights',
  metallic: 'brushed metallic surfaces with anisotropic reflections',
  transparent: 'transparent/translucent material with refraction hints',
  mixed: 'mixed materials with contrasting surface treatments',
};

export function buildPrompt(settings, productDescription) {
  const preciseModeColorWarning = !settings.creative
    ? `\nCRITICAL — PRECISE COLOR MODE ACTIVE: You MUST use the specified palette colors to cover AT LEAST 80% of the product's colored surfaces. These colors are dominant and mandatory — they must fill the majority of the product's body, panels and details. Do NOT drop, merge, or replace any color. ALL specified colors must be clearly visible. Color fidelity is the top priority.`
    : '';

  const colorPart = settings.style === 'bw_lines'
    ? 'CRITICAL: This is a pure BLACK AND WHITE LINE DRAWING. Use ONLY black lines on a white background. No color, no gray fills, no shading, no tints. Pure line art only.'
    : settings.bwForRaster
    ? 'CRITICAL: Render in pure black and white ONLY — no color, no tints, no grays other than pure black lines on white background. This is a coloring book / line art style output.'
    : settings.pantoneColors.length > 0
    ? `CRITICAL COLOR RULE — NO EXCEPTIONS: You MUST use EXCLUSIVELY these exact Pantone colors and NO other colors: ${settings.pantoneColors.map(c => `PANTONE ${c}`).join(', ')}. Do NOT substitute, approximate, or replace these colors with any other hue. If a Pantone color is orange, render it as orange — not red, not brown, not yellow. Reproduce the exact hue faithfully. EVERY color in this list MUST be clearly visible in the final image — do NOT omit any of them.${preciseModeColorWarning}`
    : `Render in monochromatic black, white, and cool grays only.${preciseModeColorWarning}`;

  const detailLabel = settings.creative
    ? 'loose, gestural and expressive — feel free to reinterpret shapes, proportions and details creatively'
    : 'highly detailed and refined';

  const cleanPart = settings.cleanDesign
    ? 'IMPORTANT: No text, no annotations, no dimension lines, no material callouts, no labels, no quotes, no numbers — pure visual sketch only.'
    : 'Include subtle construction lines and light shadow cues typical of professional ID sketches.';

  const surfaceLabel = SURFACE_LABELS[settings.surface];
  const styleLabel = STYLE_LABELS[settings.style];

  const subjectAnchor = productDescription
    ? settings.creative
      ? `INSPIRATION SUBJECT (use freely as a starting point, you may reinterpret proportions and details):\n${productDescription}`
      : `DESIGN BRIEF — Reproduce this product with perfect proportions and hand-drawn marker sketch aesthetic. Preserve the overall silhouette, concept and intent of the original design. However, where the original sketch shows rudimentary, flat, or poorly defined areas (e.g., flat belts, unclear surfaces, weak details), interpret these professionally and refine them as a skilled designer would — translating 2D flat elements into coherent 3D forms with proper volume, shading and articulation. The final render must remain clearly recognizable as the same product, with a polished but authentically hand-drawn quality (marker, colored pencils, confident strokes). Perfect proportions, refined craftsmanship, but always hand-drawn character.\n${productDescription}`
    : '';

  const textures = settings.textures || [];
  const texturePart = textures.length === 0
    ? ''
    : textures.length === 1
      ? `MATERIAL TEXTURE: Product surfaces must clearly show a realistic ${textures[0]} texture — render the grain/weave/surface character with faithful detail in the sketch style.`
      : `MATERIAL TEXTURE COMBO: The product uses two distinct materials — ${textures[0]} and ${textures[1]}. Intelligently assign each texture to different surfaces/components (e.g. primary body in ${textures[0]}, details or panels in ${textures[1]}). Both textures must be visibly distinct and rendered with faithful surface character in the sketch style.`;

  const splashColorLabel = (() => {
    const bg = settings.bgColor || { type: 'preset', value: 'white' };
    if (bg.type === 'custom') return `solid custom color with exact hex value ${bg.hex?.toUpperCase()}`;
    if (bg.type === 'pantone') return `solid ${bg.label} (${bg.hex?.toUpperCase()})`;
    const SPLASH_PRESET_LABELS = {
      white: 'pure white background', off_white: 'off-white (#F5F2EE)', cream: 'warm cream (#F5F0E0)',
      kraft: 'warm kraft tan (#C8A882)', light_gray: 'light cool gray (#D8D8D8)', mid_gray: 'medium gray (#888888)',
      charcoal: 'dark charcoal (#2A2A2A)', black: 'deep black (#111111)', navy: 'dark navy (#0D1B2A)',
      deep_blue: 'deep indigo blue (#1A237E)', forest: 'deep forest green (#1B3A2A)', deep_red: 'deep red (#4A0E0E)',
    };
    return SPLASH_PRESET_LABELS[bg.value] || 'pure white background';
  })();

  const markerColorLabel = (() => {
    const bg = settings.bgColor || { type: 'preset', value: 'white' };
    if (bg.type === 'custom') return `a raw loose marker splash in custom color ${bg.hex?.toUpperCase()}`;
    if (bg.type === 'pantone') return `a raw loose marker splash in ${bg.label} (${bg.hex?.toUpperCase()})`;
    const MARKER_PRESET_LABELS = {
      white: 'white', off_white: 'off-white (#F5F2EE)', cream: 'warm cream (#F5F0E0)',
      kraft: 'warm kraft tan (#C8A882)', light_gray: 'light cool gray (#D8D8D8)', mid_gray: 'medium gray (#888888)',
      charcoal: 'dark charcoal (#2A2A2A)', black: 'deep black (#111111)', navy: 'dark navy (#0D1B2A)',
      deep_blue: 'deep indigo blue (#1A237E)', forest: 'deep forest green (#1B3A2A)', deep_red: 'deep red (#4A0E0E)',
    };
    return MARKER_PRESET_LABELS[bg.value] || 'white';
  })();

  let bgPart = '';
  if (settings.style !== 'bw_lines') {
    if (settings.markerBg) {
      bgPart = `FINISHING — MANDATORY MARKER BACKGROUND STYLE:
1. PRODUCT OUTLINE: Apply a BOLD, THICK BLACK OUTLINE (minimum 4-5pt stroke) around the ENTIRE product silhouette. This outline MUST be dark, crisp, and define every boundary.
2. WHITE HIGHLIGHTS: Paint bright WHITE HIGHLIGHT LINES (2-3pt) on ALL key edges, creases, top curves, and prominent surfaces to create a strong halo/glow effect that makes the product pop.
3. BACKGROUND: Behind the product, create a loose, raw MARKER SPLASH/PATCH in ${markerColorLabel} with irregular organic strokes (like a real Copic marker on paper). The splash should be bold and visible.
4. SURROUNDING: The area outside the marker splash MUST be pure white paper.
Aesthetic: Professional industrial design marker sketch on white paper with dramatic color backdrop, competition-style presentation. Bold, confident strokes. High contrast between black outline, white highlights, and colored marker splash.`;
    } else if (settings.backgroundType === 'colorful') {
      bgPart = `BACKGROUND: Use a ${splashColorLabel}. The entire background is solid, no gradients, no variations.`;
    } else if (settings.backgroundType === 'splash') {
      bgPart = `BACKGROUND: Behind the product, create a loose, raw background splash/wash in ${splashColorLabel} with irregular organic strokes (like drawn freehand with marker or watercolor). The splash should feel natural and uncontrolled. Only the splash area is colored; the rest of the background is pure white paper.`;
    }
  }

  if (settings.outputMode === 'study_sheet') {
    const sheetLabel = STUDY_SHEET_LABELS[settings.studySheet];
    const strictRules = settings.creative ? '' : `RENDERING RULES:\n- Maintain the overall silhouette and proportions (≈90% fidelity)\n- You may subtly refine surfaces, edges, and construction details for a more professional result\n- Do NOT redesign the product concept — keep the same typology, components and general form\n- The output must be clearly recognizable as the same product\n`;
    const crossSectionColorNote = (settings.studySheet === 'cross_section' && !settings.creative)
      ? `\nCROSS-SECTION COLOR RULE: Even in sectional views, ALL specified colors MUST be faithfully applied to each surface/component exactly as they would appear in a normal view. Do NOT default to gray or generic tones. The cut surfaces use hatching, but all other surfaces retain their exact specified colors. This is mandatory.`
      : '';
    const markerStyleNoteSheet = settings.style === 'marker_render'
      ? `GLOBAL STYLE DIRECTIVE: This image MUST look like a real hand-drawn industrial design sketch made with Copic/alcohol markers on white paper. Key characteristics to enforce:
- Visible pencil construction lines underneath the color fills
- Flat marker color applied in bold, slightly streaky strokes (not digital gradients)
- Strong white highlight lines/dots on top edges and convex surfaces
- Thick confident black fineliner outline on the silhouette
- Overall aesthetic: professional designer sketchbook, NOT a 3D render or photorealistic image\n`
      : '';
    return `Create a professional industrial design study sheet. ${subjectAnchor}\n\n${markerStyleNoteSheet}${strictRules}Layout: ${sheetLabel}.\nRendering style: ${styleLabel}. Surface material: ${surfaceLabel}.\n${detailLabel} line quality. ${colorPart}${crossSectionColorNote}\n${texturePart}\n${cleanPart}\n${bgPart}\nNo watermarks, professional industrial design presentation quality.`;
  }

  const perspLabel = PERSPECTIVE_LABELS[settings.perspective];
  const strictRules = settings.creative ? '' : `RENDERING GUIDELINES:\n- Preserve the overall silhouette, proportions, and design intent (≈90% fidelity to original concept)\n- Translate any flat, underdeveloped, or poorly sketched areas into proper 3D forms with volume and coherence (e.g., a flat belt becomes dimensional, undefined surfaces gain clarity)\n- Apply confident marker and colored pencil strokes, with proper shading, highlights, and material definition\n- Maintain hand-drawn authenticity: this must look like a skilled designer's sketch, not a digital render\n- Do NOT alter the core product typology, major components, or overall concept\n- The result must be clearly recognizable as the same product with refined craftsmanship\n`;
  const markerStyleNote = settings.style === 'marker_render'
    ? `GLOBAL STYLE DIRECTIVE: This image MUST look like a real hand-drawn industrial design sketch made with Copic/alcohol markers on white paper. Key characteristics to enforce:
- Visible pencil construction lines underneath the color fills
- Flat marker color applied in bold, slightly streaky strokes (not digital gradients)
- Strong white highlight lines/dots on top edges and convex surfaces
- Thick confident black fineliner outline on the silhouette
- Overall aesthetic: professional designer sketchbook, NOT a 3D render or photorealistic image\n`
    : '';
  return `Create a professional industrial design sketch. ${subjectAnchor}\n\n${markerStyleNote}${strictRules}Render it as a ${styleLabel}, ${perspLabel}, with ${surfaceLabel}.\n${detailLabel} line quality. ${colorPart}\n${texturePart}\n${cleanPart}\n${bgPart}\nNo watermarks, professional presentation quality.`;
}
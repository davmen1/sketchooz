export const STYLE_LABELS = {
  marker_render: 'marker render with bold strokes and smooth gradients',
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
    ? `\nCRITICAL — PRECISE COLOR MODE ACTIVE: Every single color specified must appear visibly in the final output. Do NOT drop, merge, or replace any color. If multiple colors are listed, ALL of them must be clearly visible on the product. Color accuracy is the top priority.`
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
      : `CRITICAL SUBJECT — reproduce with absolute fidelity, do NOT alter shape or proportions:\n${productDescription}\nThe sketch must show the EXACT SAME product: same silhouette, same proportions, same components. Do not invent, add, remove or reshape any part.`
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
    const strictRules = settings.creative ? '' : `STRICT RENDERING RULES:\n- Preserve the EXACT silhouette, shape and proportions described above\n- Do NOT simplify, stylize or redesign the product — only apply the rendering style on the faithful form\n- The output must be recognizable as the same product as the input image\n`;
    return `Create a professional industrial design study sheet. ${subjectAnchor}\n\n${strictRules}Layout: ${sheetLabel}.\nRendering style: ${styleLabel}. Surface material: ${surfaceLabel}.\n${detailLabel} line quality. ${colorPart}\n${texturePart}\n${cleanPart}\n${bgPart}\nNo watermarks, professional industrial design presentation quality.`;
  }

  const perspLabel = PERSPECTIVE_LABELS[settings.perspective];
  const strictRules = settings.creative ? '' : `STRICT RENDERING RULES:\n- Preserve the EXACT silhouette, shape and proportions described above\n- Do NOT simplify, stylize or redesign the product — only apply the rendering style on the faithful form\n- The output must be recognizable as the same product as the input image\n`;
  return `Create a professional industrial design sketch. ${subjectAnchor}\n\n${strictRules}Render it as a ${styleLabel}, ${perspLabel}, with ${surfaceLabel}.\n${detailLabel} line quality. ${colorPart}\n${texturePart}\n${cleanPart}\n${bgPart}\nNo watermarks, professional presentation quality.`;
}
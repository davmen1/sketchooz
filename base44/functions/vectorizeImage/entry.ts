import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import { Buffer } from 'node:buffer';
import ImageTracer from 'npm:imagetracerjs@1.2.6';
import Jimp from 'npm:jimp@0.22.12';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return Response.json({ error: 'imageUrl is required' }, { status: 400 });
    }

    console.log('Downloading image from:', imageUrl);
    const imageRes = await fetch(imageUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!imageRes.ok) throw new Error(`Failed to download image: ${imageRes.status}`);

    const arrayBuffer = await imageRes.arrayBuffer();
    const nodeBuffer = Buffer.from(arrayBuffer);

    console.log('Processing image for line art extraction…');
    const image = await Jimp.read(nodeBuffer);

    // Resize to manageable size
    if (image.getWidth() > 1600) {
      image.resize(1600, Jimp.AUTO);
    }

    // 1. Convert to grayscale
    image.grayscale();

    // 2. Boost contrast strongly to separate lines from fills
    image.contrast(0.6);

    // 3. Threshold: pixels below midpoint → black (lines), rest → white
    image.threshold({ max: 128 });

    // (lines = black, background/fills = white — coloring book style)

    const width = image.getWidth();
    const height = image.getHeight();

    // Build RGBA image data for imagetracerjs
    // Since grayscale+threshold: dark = line (black), light = background (white)
    const rawData = new Uint8ClampedArray(image.bitmap.data);
    const imgData = { width, height, data: rawData };

    console.log(`Tracing lines on ${width}x${height} image…`);

    // 2 colors only: black lines + white background
    const options = {
      numberofcolors: 2,
      colorquantcycles: 1,
      ltres: 0.5,
      qtres: 0.5,
      pathomit: 4,
      blurradius: 0,
      blurdelta: 0,
      strokewidth: 0,
      linefilter: true,
      scale: 1,
      roundcoords: 1,
      viewbox: true,
      desc: false,
    };

    const svgRaw = ImageTracer.imagedataToSVG(imgData, options);

    if (!svgRaw || !svgRaw.includes('<svg')) {
      throw new Error('SVG generation failed — empty output');
    }

    // Remove white background paths so SVG has transparent bg + black lines only
    // Remove any near-white paths (all channels >= 220)
    const svgClean = svgRaw.replace(/<path\b[^>]*fill="rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)"[^>]*\/>/gs, (match, r, g, b) => {
      return (parseInt(r) >= 220 && parseInt(g) >= 220 && parseInt(b) >= 220) ? '' : match;
    });
    console.log('SVG clean length:', svgClean.length, '| raw paths removed:', (svgRaw.match(/<path/g)||[]).length - (svgClean.match(/<path/g)||[]).length);

    console.log('Line art SVG generated, length:', svgClean.length);

    return new Response(svgClean, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': 'attachment; filename="sketch-lineart.svg"',
      },
    });
  } catch (error) {
    console.error('Vectorization error:', error.message, error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
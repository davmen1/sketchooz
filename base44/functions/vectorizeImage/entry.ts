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

    // Resize large images — keep full resolution for max quality (max 2400px wide)
    console.log('Pre-processing image with Jimp, bytes:', nodeBuffer.length);
    const image = await Jimp.read(nodeBuffer);
    if (image.getWidth() > 2400) {
      image.resize(2400, Jimp.AUTO);
    }
    // No contrast boost — preserve original shading
    const pngBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

    // Build an ImageData-like object for imagetracerjs
    const img = await Jimp.read(pngBuffer);
    const width = img.getWidth();
    const height = img.getHeight();

    // imagetracerjs expects { width, height, data: Uint8ClampedArray } (RGBA)
    const rawData = new Uint8ClampedArray(img.bitmap.data);
    const imgData = { width, height, data: rawData };

    console.log(`Vectorizing ${width}x${height} image with imagetracerjs (full color)…`);

    // Options: MAXIMUM quality — minimal simplification, full color range
    const options = {
      // Color quantization: 64 colors, 6 cycles for best color fidelity
      numberofcolors: 64,
      colorquantcycles: 6,
      // Tracing: extremely precise
      ltres: 0.1,        // line threshold (very low = maximum detail)
      qtres: 0.1,        // quadratic spline threshold (very low = very smooth curves)
      pathomit: 0,       // keep every path regardless of size
      // No blur — preserve all shading details
      blurradius: 0,
      blurdelta: 0,
      // SVG options
      strokewidth: 0,
      linefilter: false,
      scale: 1,
      roundcoords: 2,
      viewbox: true,
      desc: false,
    };

    const svgString = ImageTracer.imagedataToSVG(imgData, options);

    if (!svgString || !svgString.includes('<svg')) {
      throw new Error('SVG generation failed — empty output');
    }

    console.log('SVG generated, length:', svgString.length);

    return new Response(svgString, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': 'attachment; filename="sketch-vector.svg"',
      },
    });
  } catch (error) {
    console.error('Vectorization error:', error.message, error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
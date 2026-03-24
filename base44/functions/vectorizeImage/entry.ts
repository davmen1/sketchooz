import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import { Buffer } from 'node:buffer';
import potrace from 'npm:potrace@2.1.8';
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
    const imageRes = await fetch(imageUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (!imageRes.ok) throw new Error(`Failed to download image: ${imageRes.status}`);

    const arrayBuffer = await imageRes.arrayBuffer();
    const nodeBuffer = Buffer.from(arrayBuffer);

    console.log('Processing image with Jimp, bytes:', nodeBuffer.length);
    const image = await Jimp.read(nodeBuffer);
    image.grayscale().contrast(0.3);
    const processedBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

    console.log('Vectorizing with potrace...');
    const svg = await new Promise((resolve, reject) => {
      potrace.trace(processedBuffer, {
        threshold: 128,
        turdSize: 2,
        optCurve: true,
        optTolerance: 0.2,
        turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY,
      }, (err, svg) => {
        if (err) reject(err);
        else resolve(svg);
      });
    });

    console.log('SVG generated, length:', svg.length);

    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': 'attachment; filename="sketch-vector.svg"',
      },
    });
  } catch (error) {
    console.error('Vectorization error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
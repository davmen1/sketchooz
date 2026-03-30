import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import { jsPDF } from 'npm:jspdf@4.0.0';

function generateCode(imageUrl) {
  // Create a deterministic code from imageUrl + a stable hash
  const str = imageUrl + '_sketchooz_license';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  return `SKZ-${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'enterprise' && user.role !== 'admin') {
      return Response.json({ error: 'Enterprise plan required' }, { status: 403 });
    }

    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return Response.json({ error: 'imageUrl required' }, { status: 400 });
    }

    const licenseCode = generateCode(imageUrl);
    const today = new Date().toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    // Header
    doc.setFillColor(30, 30, 30);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('SKETCHOOZ', 20, 16);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Commercial License Certificate', 20, 23);

    // Title
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('LICENZA COMMERCIALE / COMMERCIAL LICENSE', 20, 42);

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 46, 190, 46);

    // License code box
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(20, 52, 170, 22, 3, 3, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Codice licenza / License Code', 105, 59, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(licenseCode, 105, 68, { align: 'center' });

    // Details
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`Titolare / Holder: ${user.full_name || user.email}`, 20, 84);
    doc.text(`Email: ${user.email}`, 20, 91);
    doc.text(`Data di emissione / Issue Date: ${today}`, 20, 98);
    doc.text('Piano / Plan: Enterprise', 20, 105);

    // Divider
    doc.setDrawColor(220, 220, 220);
    doc.line(20, 111, 190, 111);

    // IT section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text('ITALIANO', 20, 120);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const itText = [
      'Il presente certificato attesta che il titolare indicato sopra possiede una licenza commerciale valida',
      'per gli output generati tramite Sketchooz nell\'ambito del piano Enterprise.',
      '',
      'La licenza autorizza:',
      '• Utilizzo degli sketch generati per progetti commerciali e clienti',
      '• Inclusione in portafolio professionali e materiali di marketing',
      '• Rivendita o sublicenza degli output a terzi come parte di un prodotto o servizio',
      '',
      'Il codice licenza univoco sopra riportato e abbinato all\'immagine generata e costituisce',
      'prova legale del diritto di utilizzo commerciale.',
    ];
    let y = 127;
    itText.forEach(line => { doc.text(line, 20, y); y += 5.5; });

    // EN section
    y += 3;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text('ENGLISH', 20, y);
    y += 7;

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const enText = [
      'This certificate confirms that the holder identified above holds a valid commercial license',
      'for outputs generated via Sketchooz under the Enterprise plan.',
      '',
      'The license authorizes:',
      '• Use of generated sketches for commercial projects and clients',
      '• Inclusion in professional portfolios and marketing materials',
      '• Resale or sublicensing of outputs to third parties as part of a product or service',
      '',
      'The unique license code above is linked to the generated image and constitutes',
      'legal proof of commercial usage rights.',
    ];
    enText.forEach(line => { doc.text(line, 20, y); y += 5.5; });

    // Footer
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 272, 210, 25, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(130, 130, 130);
    doc.text('Treddi Studio — treddistudio@gmail.com — www.sketchooz.com', 105, 281, { align: 'center' });
    doc.text(`Documento generato automaticamente il ${today}`, 105, 287, { align: 'center' });

    const pdfBytes = doc.output('arraybuffer');

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=sketchooz-license-${licenseCode}.pdf`,
      },
    });
  } catch (error) {
    console.error('generateLicensePDF error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
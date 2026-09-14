import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import puppeteer from 'https://deno.land/x/puppeteer@16.2.0/mod.ts';

serve(async (req) => {
  const { pages, metadata } = await req.json();
  
  const htmlPages = pages.map((page: any, i: number) => {
    const content = page.type === 'puzzle' ? 
      `<div class="puzzle">${page.grid.map((row: any) => 
        '<div>' + row.map((cell: any) => cell || '&nbsp;').join(' ') + '</div>'
      ).join('')}</div>` : 
      `<div class="content">${page.content}</div>`;
    
    return `
      <!DOCTYPE html>
      <html><head><style>
        @page { 
          size: ${metadata.trimWidth}in ${metadata.trimHeight}in; 
          margin: 0; 
        }
        body { margin: 0; padding: ${metadata.margin}in; font-family: Arial; }
        .bleed { width: calc(100% + ${(metadata.bleed * 2)}in); margin: -${metadata.bleed}in; }
        .puzzle { font-family: monospace; line-height: 1.2; }
      </style></head>
      <body><div class="bleed">${content}</div></body></html>
    `;
  });
  
  const browser = await puppeteer.launch();
  const pdfBuffers = [];
  
  for (const html of htmlPages) {
    const page = await browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf({ printBackground: true, margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' } });
    pdfBuffers.push(pdf);
  }
  
  await browser.close();
  
  // Merge PDFs (simplified - in prod use pdf-lib)
  const merged = new Uint8Array(pdfBuffers.reduce((acc, buf) => acc + buf.byteLength, 0));
  let offset = 0;
  for (const buf of pdfBuffers) {
    merged.set(new Uint8Array(buf), offset);
    offset += buf.byteLength;
  }
  
  return new Response(merged, {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="book.pdf"' }
  });
});

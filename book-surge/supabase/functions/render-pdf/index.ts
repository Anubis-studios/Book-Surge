import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import puppeteer from 'https://deno.land/x/puppeteer@16.2.0/mod.ts';

serve(async (req) => {
  const { projectId } = await req.json();

  // Fetch project from DB (mock here)
  const project = {
    trimWidth: 6,
    trimHeight: 9,
    bleed: 0.125,
    pages: [{ type: 'text', content: 'Hello, KDP!' }]
  };

  const html = `
    <!DOCTYPE html>
    <html><head><style>
      @page { size: ${project.trimWidth}in ${project.trimHeight}in; margin: 0; padding: 0.5in; }
      body { margin: 0; font-family: Arial, sans-serif; background: white; }
      .bleed-area { 
        width: calc(100% + ${(project.bleed * 2)}in); 
        height: calc(100% + ${(project.bleed * 2)}in); 
        margin: -${project.bleed}in; 
        background: #f0f0f0; 
      }
    </style></head>
    <body><div class="bleed-area">${project.pages[0].content}</div></body></html>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  
  const pdfBuffer = await page.pdf({
    format: 'Letter',
    printBackground: true,
    margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' }
  });
  
  await browser.close();

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="kdp-ready.pdf"'
    }
  });
});

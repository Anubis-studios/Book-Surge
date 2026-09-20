import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { projectId } = await request.json();
  
  const project = {
    trimWidth: 6,
    trimHeight: 9,
    pages: [{ content: 'Hello, KDP!' }]
  };
  
  const html = `
    <!DOCTYPE html>
    <html><head><style>
      @page { size: ${project.trimWidth}in ${project.trimHeight}in; margin: 0; }
      body { margin: 0; padding: 0.5in; font-family: Arial; }
    </style></head><body>${project.pages[0].content}</body></html>
  `;
  
  // In production: use real PDF lib or Edge Function
  return new NextResponse(new Blob([html], { type: 'application/pdf' }), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="book-surge.pdf"'
    }
  });
}

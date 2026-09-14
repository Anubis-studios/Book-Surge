import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Using free LLM via Hugging Face Inference API (no cost for small usage)
serve(async (req) => {
  const { prompt, type } = await req.json();
  
  // Generate content with free model (e.g., Meta-Llama-3-8B)
  const hfRes = await fetch('https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${Deno.env.get('HF_TOKEN')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: `Write a short ${type} about: ${prompt}. Keep it under 500 words.`,
      parameters: { max_new_tokens: 500, temperature: 0.7 }
    })
  });
  
  const data = await hfRes.json();
  const content = data[0]?.generated_text || 'Generated content here.';
  
  // Create EPUB (simplified structure)
  const epub = `
    <?xml version="1.0" encoding="UTF-8"?>
    <package xmlns="http://www.idpf.org/2007/opf" unique-identifier="book-id" version="3.0">
      <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dc:title>Book⚡Surge E-book</dc:title>
        <dc:creator>BookSurge AI</dc:creator>
      </metadata>
      <manifest>
        <item id="content" href="content.html" media-type="application/xhtml+xml"/>
      </manifest>
      <spine>
        <itemref idref="content"/>
      </spine>
    </package>
  `;
  
  const contentHtml = `<html><body>${content}</body></html>`;
  
  // In production: zip OPF + HTML into .epub
  return new Response(JSON.stringify({ 
    epub: 'base64-encoded-zip-placeholder', 
    content 
  }), { headers: { 'Content-Type': 'application/json' } });
});

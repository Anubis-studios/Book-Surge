import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req) => {
  const { prompt } = await req.json();

  // Call DALL·E
  const openaiRes = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: `${prompt}, book illustration, high quality`,
      n: 1,
      size: "1024x1024"
    })
  });

  const data = await openaiRes.json();
  const imageUrl = data.data[0].url;

  // Download and save to Supabase Storage
  const imgRes = await fetch(imageUrl);
  const imgBuffer = await imgRes.arrayBuffer();
  const filename = `ai-images/${crypto.randomUUID()}.png`;
  
  const { data: uploadData, error } = await supabase.storage
    .from('book-assets')
    .upload(filename, imgBuffer, { contentType: 'image/png' });

  if (error) throw error;

  const publicUrl = supabase.storage.from('book-assets').getPublicUrl(filename).data.publicUrl;

  return new Response(JSON.stringify({ url: publicUrl }), {
    headers: { 'Content-Type': 'application/json' }
  });
});

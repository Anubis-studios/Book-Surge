#!/bin/bash

echo "🚀 Setting up Book⚡Surge..."

npm install

git init && git add . && git commit -m "Initial Book⚡Surge commit"

if command -v vercel &> /dev/null; then
  echo "☁️ Deploying to Vercel..."
  vercel --prod
else
  echo "⚠️ Install Vercel CLI: npm i -g vercel, then run 'vercel --prod'"
fi

echo "🔑 Next: Create Supabase project at https://supabase.com"
echo "   → Copy URL and anon key into .env.local"

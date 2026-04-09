#!/bin/bash
# Script to generate and insert sample data into Supabase

echo "🚀 Starting sample data generation..."
echo ""

# Check if .env file exists
if [ ! -f ../.env ]; then
  echo "❌ Error: .env file not found in project root"
  echo "Please create .env file with your Supabase credentials:"
  echo "VITE_SUPABASE_URL=your_url"
  echo "VITE_SUPABASE_ANON_KEY=your_key"
  exit 1
fi

# Install dotenv if needed
if ! node -e "require('dotenv')" 2>/dev/null; then
  echo "📦 Installing dotenv..."
  npm install dotenv
fi

# Run the script
echo "⏳ Running data generation script..."
echo ""
node generate-sample-data.js

echo ""
echo "✅ Done!"

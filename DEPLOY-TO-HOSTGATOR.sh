#!/bin/bash

echo "🚀 DEPLOYING TO HOSTGATOR (Your Existing Hosting)"
echo "================================================"
echo ""

# Build the Next.js app as static files
echo "📦 Building static files for HostGator..."
npm run build

# Export as static HTML (works on any hosting)
echo "📁 Creating static export..."
npx next export -o hostgator-files

echo ""
echo "✅ Files ready for HostGator!"
echo ""
echo "📤 UPLOAD THESE FILES TO HOSTGATOR:"
echo "===================================="
echo ""
echo "1. Login to HostGator cPanel"
echo "   https://portal.hostgator.com"
echo ""
echo "2. Open File Manager"
echo ""
echo "3. Navigate to: public_html/"
echo ""
echo "4. Upload everything from: hostgator-files/"
echo ""
echo "5. DONE! mcphubz.com will show your new site!"
echo ""
echo "Files to upload are in: ./hostgator-files/"
ls -la hostgator-files/ | head -10
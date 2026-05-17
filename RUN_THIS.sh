#!/bin/bash

echo "════════════════════════════════════════════════════════════"
echo "  🏨 SHIYAF HOTELS - APK BUILD SCRIPT"
echo "════════════════════════════════════════════════════════════"
echo ""

# Navigate to mobile folder
cd "/Users/hysam/Desktop/projects/shiyaf hotels/mobile"

echo "📦 Step 1/5: Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    echo ""
    echo "Try running manually:"
    echo "  cd \"/Users/hysam/Desktop/projects/shiyaf hotels/mobile\""
    echo "  npm install"
    exit 1
fi
echo "✅ Dependencies installed!"
echo ""

echo "🔨 Step 2/5: Building web app..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Failed to build web app"
    exit 1
fi
echo "✅ Web app built!"
echo ""

echo "📱 Step 3/5: Installing EAS CLI..."
npm install -g eas-cli
if [ $? -ne 0 ]; then
    echo "⚠️  Failed to install globally, trying with sudo..."
    sudo npm install -g eas-cli
fi
echo "✅ EAS CLI installed!"
echo ""

echo "🔐 Step 4/5: Login to Expo..."
echo ""
echo "⚠️  IMPORTANT: You need to create a FREE account at expo.dev"
echo "   If you don't have an account, press Ctrl+C and create one first"
echo ""
eas login
if [ $? -ne 0 ]; then
    echo "❌ Login failed"
    echo ""
    echo "Please create an account at: https://expo.dev/signup"
    exit 1
fi
echo "✅ Logged in!"
echo ""

echo "🚀 Step 5/5: Building APK in the cloud..."
echo ""
echo "⏰ This will take about 10-15 minutes..."
echo "   You'll get a download link when it's done!"
echo ""
eas build -p android --profile preview
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  🎉 SUCCESS!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Your APK is ready to download!"
echo ""
echo "📱 Next steps:"
echo "  1. Click the download link above"
echo "  2. Download the APK file"
echo "  3. Share via WhatsApp!"
echo ""
echo "════════════════════════════════════════════════════════════"

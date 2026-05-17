#!/bin/bash

echo "🚀 Deploying backend to GitHub..."

cd "/Users/hysam/Desktop/projects/shiyaf hotels/backend"

git add .
git commit -m "Fix TypeScript configuration for deployment"
git push

echo "✅ Pushed to GitHub!"
echo "⏰ Render will automatically redeploy in ~2 minutes"
echo "📊 Check status at: https://dashboard.render.com"

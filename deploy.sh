#!/bin/bash
# deploy.sh - Quick deployment script for Base44 CLI

set -e

# Configuration
SERVER_USER=${1:-user}
SERVER_HOST=${2:-your-server.com}
SERVER_PATH=${3:-/opt/base44-cli}

echo "🚀 Deploying Base44 CLI to $SERVER_USER@$SERVER_HOST:$SERVER_PATH"

# Step 1: Build locally
echo "📦 Building locally..."
npm run build

# Step 2: Create deployment package
echo "📭 Preparing deployment package..."
mkdir -p deploy-pkg
cp -r dist deploy-pkg/
cp bin/run.js deploy-pkg/bin
cp package.json deploy-pkg/
cp DEPLOYMENT.md deploy-pkg/

# Step 3: Upload to server
echo "🌐 Uploading to server..."
ssh $SERVER_USER@$SERVER_HOST "mkdir -p $SERVER_PATH"
scp -r deploy-pkg/* $SERVER_USER@$SERVER_HOST:$SERVER_PATH/

# Step 4: Verify on server
echo "✅ Verifying installation..."
ssh $SERVER_USER@$SERVER_HOST "cd $SERVER_PATH && node ./bin/run.js --help > /dev/null && echo 'CLI is working!'"

echo "🎉 Deployment complete!"
echo ""
echo "Next steps on the server:"
echo "  ssh $SERVER_USER@$SERVER_HOST"
echo "  cd $SERVER_PATH"
echo "  node ./bin/run.js --help"
echo ""
echo "Full deployment guide: See DEPLOYMENT.md"

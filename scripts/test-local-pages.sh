#!/bin/bash

# Local GitHub Pages Simulation Script
# This script simulates the GitHub Pages deployment structure locally

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

REPO_NAME=$(basename -s .git "$(git config --get remote.origin.url)" 2>/dev/null || echo "repos-hub")
PORT=${1:-8080}

echo -e "${BLUE}🌐 Local GitHub Pages Simulation${NC}"
echo -e "Repository: ${GREEN}$REPO_NAME${NC}"
echo -e "Port: ${GREEN}$PORT${NC}"
echo ""

# Build both apps with correct paths
echo -e "${YELLOW}📦 Building apps for multi-app deployment...${NC}"
VITE_BASE_PATH="/$REPO_NAME/default/" pnpm exec nx build @repos-hub/repos-hub-default
RSBUILD_PUBLIC_PATH="/$REPO_NAME/enhanced/" pnpm exec nx build @repos-hub/repos-hub-enhanced

# Create simulation directory
echo -e "${YELLOW}🔧 Setting up local simulation...${NC}"
rm -rf _local_pages
mkdir -p _local_pages

# Add .nojekyll file
touch _local_pages/.nojekyll

# Copy 404.html if it exists
if [ -f "public/404.html" ]; then
  cp public/404.html _local_pages/404.html
fi

# Create index.html for app selection
cat > _local_pages/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Repos Hub - Choose App (Local)</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    h1 {
      margin-bottom: 2rem;
      font-size: 2.5rem;
      font-weight: 300;
    }
    .badge {
      background: rgba(255, 165, 0, 0.3);
      color: #ffa500;
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-size: 0.9rem;
      margin-bottom: 2rem;
      display: inline-block;
    }
    .apps {
      display: flex;
      gap: 2rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    .app-card {
      background: rgba(255, 255, 255, 0.2);
      padding: 2rem;
      border-radius: 15px;
      text-decoration: none;
      color: white;
      transition: transform 0.3s ease, background 0.3s ease;
      min-width: 200px;
    }
    .app-card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.3);
    }
    .app-card h2 {
      margin: 0 0 1rem 0;
      font-size: 1.5rem;
    }
    .app-card p {
      margin: 0;
      opacity: 0.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">🏠 Local Development</div>
    <h1>🚀 Repos Hub</h1>
    <div class="apps">
      <a href="./default/" class="app-card">
        <h2>Default App</h2>
        <p>Vite + React application</p>
      </a>
      <a href="./enhanced/" class="app-card">
        <h2>Enhanced App</h2>
        <p>Rsbuild + React application</p>
      </a>
    </div>
  </div>
</body>
</html>
EOF

# Copy built apps to subdirectories
if [ -d "packages/repos-hub-default/dist" ]; then
  cp -r packages/repos-hub-default/dist _local_pages/default
  # Add 404.html to handle SPA routing in subdirectory
  if [ -f "_local_pages/default/index.html" ]; then
    cp _local_pages/default/index.html _local_pages/default/404.html
  fi
  echo -e "${GREEN}✅ Default app copied to _local_pages/default${NC}"
fi

if [ -d "packages/repos-hub-enhanced/dist" ]; then
  cp -r packages/repos-hub-enhanced/dist _local_pages/enhanced
  # Add 404.html to handle SPA routing in subdirectory
  if [ -f "_local_pages/enhanced/index.html" ]; then
    cp _local_pages/enhanced/index.html _local_pages/enhanced/404.html
  fi
  echo -e "${GREEN}✅ Enhanced app copied to _local_pages/enhanced${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Local simulation ready!${NC}"
echo -e "${BLUE}Starting local server on port $PORT...${NC}"
echo ""
echo -e "${YELLOW}URLs:${NC}"
echo -e "  Home page: ${GREEN}http://localhost:$PORT/${NC}"
echo -e "  Default app: ${GREEN}http://localhost:$PORT/default/${NC}"
echo -e "  Enhanced app: ${GREEN}http://localhost:$PORT/enhanced/${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"

# Start local server
if command -v python3 &> /dev/null; then
  cd _local_pages && python3 -m http.server $PORT
elif command -v python &> /dev/null; then
  cd _local_pages && python -m SimpleHTTPServer $PORT
elif command -v npx &> /dev/null; then
  cd _local_pages && npx serve -p $PORT
else
  echo -e "${RED}❌ No suitable HTTP server found${NC}"
  echo "Please install Python or Node.js to run the local server"
  exit 1
fi

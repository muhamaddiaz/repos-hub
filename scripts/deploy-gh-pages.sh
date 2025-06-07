#!/bin/bash

# GitHub Pages Deployment Helper Script
# This script helps you test and deploy your Nx monorepo to GitHub Pages

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get repository name from git remote
REPO_NAME=$(basename -s .git "$(git config --get remote.origin.url)" 2>/dev/null || echo "repos-hub")

echo -e "${BLUE}🚀 GitHub Pages Deployment Helper${NC}"
echo -e "Repository: ${GREEN}$REPO_NAME${NC}"
echo ""

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND] [APP]"
    echo ""
    echo "Commands:"
    echo "  build    Build app(s) for GitHub Pages"
    echo "  preview  Build and preview app(s) locally"
    echo "  deploy   Deploy to GitHub Pages (requires git push)"
    echo "  help     Show this help message"
    echo ""
    echo "Apps:"
    echo "  default  Build repos-hub-default app"
    echo "  enhanced Build repos-hub-enhanced app"
    echo "  both     Build both apps"
    echo ""
    echo "Examples:"
    echo "  $0 build default"
    echo "  $0 preview both"
    echo "  $0 deploy"
}

# Function to build apps
build_apps() {
    local app=$1
    local base_path="/$REPO_NAME/"
    
    echo -e "${YELLOW}📦 Building apps for GitHub Pages...${NC}"
    echo -e "Base path: ${GREEN}$base_path${NC}"
    
    case $app in
        "default")
            echo -e "${BLUE}Building repos-hub-default...${NC}"
            VITE_BASE_PATH="$base_path" pnpm exec nx build @repos-hub/repos-hub-default
            echo -e "${GREEN}✅ Default app built successfully${NC}"
            ;;
        "enhanced")
            echo -e "${BLUE}Building repos-hub-enhanced...${NC}"
            RSBUILD_PUBLIC_PATH="$base_path" pnpm exec nx build @repos-hub/repos-hub-enhanced
            echo -e "${GREEN}✅ Enhanced app built successfully${NC}"
            ;;
        "both")
            echo -e "${BLUE}Building both apps...${NC}"
            VITE_BASE_PATH="$base_path" pnpm exec nx build @repos-hub/repos-hub-default
            RSBUILD_PUBLIC_PATH="$base_path" pnpm exec nx build @repos-hub/repos-hub-enhanced
            echo -e "${GREEN}✅ Both apps built successfully${NC}"
            ;;
        *)
            echo -e "${RED}❌ Invalid app: $app${NC}"
            echo "Valid options: default, enhanced, both"
            exit 1
            ;;
    esac
}

# Function to preview apps
preview_apps() {
    local app=$1
    
    # Build first
    build_apps "$app"
    
    echo ""
    echo -e "${YELLOW}👀 Starting preview server...${NC}"
    
    case $app in
        "default")
            echo -e "${BLUE}Preview URL: ${GREEN}http://localhost:4300${NC}"
            cd packages/repos-hub-default
            pnpm exec vite preview --port 4300
            ;;
        "enhanced")
            echo -e "${BLUE}Preview URL: ${GREEN}http://localhost:4301${NC}"
            cd packages/repos-hub-enhanced
            pnpm exec rsbuild preview --port 4301
            ;;
        "both")
            echo -e "${BLUE}Both apps built. Choose one to preview:${NC}"
            echo "1. Default app: cd packages/repos-hub-default && pnpm exec vite preview"
            echo "2. Enhanced app: cd packages/repos-hub-enhanced && pnpm exec rsbuild preview"
            ;;
    esac
}

# Function to deploy
deploy() {
    echo -e "${YELLOW}🚀 Deploying to GitHub Pages...${NC}"
    
    # Check if we're on main branch
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "main" ]; then
        echo -e "${YELLOW}⚠️  Warning: You're on branch '$current_branch', not 'main'${NC}"
        read -p "Continue deployment? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${RED}❌ Deployment cancelled${NC}"
            exit 1
        fi
    fi
    
    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
        git status --short
        read -p "Commit and push changes? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git add .
            read -p "Enter commit message: " commit_msg
            git commit -m "${commit_msg:-Update for GitHub Pages deployment}"
        fi
    fi
    
    echo -e "${BLUE}Pushing to main branch...${NC}"
    git push origin main
    
    echo ""
    echo -e "${GREEN}✅ Deployment triggered!${NC}"
    echo -e "${BLUE}Check deployment status at: ${GREEN}https://github.com/$(git config --get remote.origin.url | sed 's/.*://;s/.git$//')/actions${NC}"
    echo -e "${BLUE}Your site will be available at: ${GREEN}https://$(git config --get remote.origin.url | sed 's/.*://;s/.git$//' | cut -d'/' -f1).github.io/$REPO_NAME/${NC}"
}

# Main script logic
case "${1:-help}" in
    "build")
        build_apps "${2:-both}"
        ;;
    "preview")
        preview_apps "${2:-both}"
        ;;
    "deploy")
        deploy
        ;;
    "help"|*)
        show_usage
        ;;
esac

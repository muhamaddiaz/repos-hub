# GitHub Pages Deployment Guide

This guide explains how to deploy your Nx monorepo applications to GitHub Pages.

## 🚀 Quick Setup

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**

### 2. Deployment Options

The deployment workflow supports three modes:

#### Automatic Deployment (Push to main)
- Automatically detects which apps have changed
- Deploys only the affected applications
- Triggered on every push to `main` branch

#### Manual Deployment
- Go to **Actions** tab in your repository
- Click on "Deploy to GitHub Pages" workflow
- Click **Run workflow**
- Choose which app to deploy:
  - `repos-hub-default` - Vite + React application
  - `repos-hub-enhanced` - Rsbuild + React application  
  - `both` - Deploy both applications with an app selector page

## 📁 Application Structure

- **Default App** (`@repos-hub/repos-hub-default`):
  - Built with Vite
  - Output: `packages/repos-hub-default/dist/`
  - URL: `https://[username].github.io/[repo-name]/` (single app) or `https://[username].github.io/[repo-name]/default/` (multi-app)

- **Enhanced App** (`@repos-hub/repos-hub-enhanced`):
  - Built with Rsbuild
  - Output: `packages/repos-hub-enhanced/dist/`
  - URL: `https://[username].github.io/[repo-name]/` (single app) or `https://[username].github.io/[repo-name]/enhanced/` (multi-app)

## ⚙️ Configuration Details

### Environment Variables

The build process uses environment variables to set the correct base paths:

- `VITE_BASE_PATH` - Sets the base path for Vite builds
- `RSBUILD_PUBLIC_PATH` - Sets the asset prefix for Rsbuild builds

### Build Commands

```bash
# Build default app for GitHub Pages
VITE_BASE_PATH="/repo-name/" pnpm exec nx build @repos-hub/repos-hub-default

# Build enhanced app for GitHub Pages  
RSBUILD_PUBLIC_PATH="/repo-name/" pnpm exec nx build @repos-hub/repos-hub-enhanced

# Build both apps
pnpm exec nx run-many -t build --projects=@repos-hub/repos-hub-default,@repos-hub/repos-hub-enhanced
```

## 🔧 Local Testing

Test your GitHub Pages deployment locally:

```bash
# Build the app(s)
pnpm exec nx build @repos-hub/repos-hub-default

# Serve the built files
cd packages/repos-hub-default
pnpm exec vite preview --port 4300

# Or for enhanced app
cd packages/repos-hub-enhanced  
pnpm exec rsbuild preview
```

## 📝 Troubleshooting

### Common Issues

1. **404 errors on refresh**: 
   - Ensure your app is configured as a Single Page Application (SPA)
   - Check that routing is handled correctly for GitHub Pages

2. **Assets not loading**:
   - Verify the base path is correctly set in your build configuration
   - Check that the `VITE_BASE_PATH` or `RSBUILD_PUBLIC_PATH` environment variables are used

3. **Build failures**:
   - Check that all dependencies are properly installed
   - Ensure TypeScript compilation is successful
   - Verify that tests pass before deployment

### Deployment Status

Check deployment status:
- Go to **Actions** tab in your repository
- Look for the "Deploy to GitHub Pages" workflow runs
- Click on a run to see detailed logs

### Custom Domain

To use a custom domain:
1. Add a `CNAME` file to your repository root with your domain
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings to use your custom domain

## 🎯 Next Steps

- Set up branch protection rules for the `main` branch
- Configure automatic deployments on pull request previews
- Add deployment notifications to Slack/Discord
- Set up monitoring and analytics for your deployed applications

## 📚 Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Nx Documentation](https://nx.dev/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [Rsbuild Deployment Guide](https://rsbuild.dev/guide/basic/deploy)

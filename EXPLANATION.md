# ReposHub

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is almost ready ✨.

A modern monorepo containing multiple React applications built with Nx, featuring both Vite and Rsbuild configurations.

## 🚀 Applications

- **Default App** (`@repos-hub/repos-hub-default`) - Vite + React application
- **Enhanced App** (`@repos-hub/repos-hub-enhanced`) - Rsbuild + React application  
- **Shared UI** (`shared-ui`) - Shared component library

## 📦 Quick Start

```sh
# Install dependencies
pnpm install

# Start development servers
pnpm exec nx serve @repos-hub/repos-hub-default  # http://localhost:4200
pnpm exec nx dev @repos-hub/repos-hub-enhanced   # http://localhost:4200

# Build applications
pnpm exec nx build @repos-hub/repos-hub-default
pnpm exec nx build @repos-hub/repos-hub-enhanced

# Run tests
pnpm exec nx test @repos-hub/repos-hub-default
pnpm exec nx test @repos-hub/repos-hub-enhanced
```

## 🌐 GitHub Pages Deployment

This workspace is configured for automatic deployment to GitHub Pages. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Quick Deploy

```sh
# Using the helper script
./scripts/deploy-gh-pages.sh build both    # Build both apps
./scripts/deploy-gh-pages.sh preview both  # Build and preview locally
./scripts/deploy-gh-pages.sh deploy        # Deploy to GitHub Pages
```

### Manual Deploy Commands

```sh
# Build for GitHub Pages
VITE_BASE_PATH="/repos-hub/" pnpm exec nx build @repos-hub/repos-hub-default
RSBUILD_PUBLIC_PATH="/repos-hub/" pnpm exec nx build @repos-hub/repos-hub-enhanced

# Push to main branch to trigger deployment
git push origin main
```

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/js?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created.

## Finish your CI setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/L9DZ2v5kqc)


## Generate a library

```sh
npx nx g @nx/js:lib packages/pkg1 --publishable --importPath=@my-org/pkg1
```

## Run tasks

To build the library use:

```sh
npx nx build pkg1
```

To run any task with Nx use:

```sh
npx nx <target> <project-name>
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Versioning and releasing

To version and release the library use

```
npx nx release
```

Pass `--dry-run` to see what would happen without actually releasing the library.

[Learn more about Nx release &raquo;](hhttps://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Keep TypeScript project references up to date

Nx automatically updates TypeScript [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) in `tsconfig.json` files to ensure they remain accurate based on your project dependencies (`import` or `require` statements). This sync is automatically done when running tasks such as `build` or `typecheck`, which require updated references to function correctly.

To manually trigger the process to sync the project graph dependencies information to the TypeScript project references, run the following command:

```sh
npx nx sync
```

You can enforce that the TypeScript project references are always in the correct state when running in CI by adding a step to your CI job configuration that runs the following command:

```sh
npx nx sync:check
```

[Learn more about nx sync](https://nx.dev/reference/nx-commands#sync)


[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/js?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

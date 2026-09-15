# Angular CLI — Complete Command Reference

## Installation

```bash
npm install -g @angular/cli
```

Check version:
```bash
ng version
# or
ng v
```

Update the CLI:
```bash
npm install -g @angular/cli@latest
```

---

## Project Creation

### `ng new`
Creates a new Angular workspace/project.

```bash
ng new my-app
```

Common flags:
```bash
ng new my-app --routing              # adds routing module
ng new my-app --style=scss           # set stylesheet format (css, scss, sass, less)
ng new my-app --standalone           # standalone components (default in v17+)
ng new my-app --skip-install         # don't run npm install
ng new my-app --strict               # enable strict type checking
ng new my-app --package-manager=yarn # use yarn/pnpm/npm/bun
ng new my-app --dry-run              # preview without writing files
```

---

## Running the Dev Server

### `ng serve`
Builds and serves the app with live reload.

```bash
ng serve
```

Flags:
```bash
ng serve --open              # (-o) opens browser automatically
ng serve --port=4300         # custom port (default 4200)
ng serve --host=0.0.0.0      # expose on network
ng serve --configuration=production  # (-c) use a specific build config
ng serve --ssl               # serve over https
ng serve --proxy-config proxy.conf.json  # use a proxy config for API calls
```

---

## Code Generation — `ng generate` (alias `ng g`)

General syntax:
```bash
ng generate <schematic> <name> [options]
```

### Components
```bash
ng generate component my-component
ng g c my-component
```
Options:
```bash
ng g c my-component --standalone       # standalone component
ng g c my-component --skip-tests       # no .spec.ts file
ng g c my-component --inline-style     # style inside the component file
ng g c my-component --inline-template  # template inside the component file
ng g c my-component --flat             # don't create a new folder
ng g c my-component --change-detection=OnPush
ng g c features/my-component           # nested path
```

### Other schematics
```bash
ng generate directive my-directive     # ng g d
ng generate pipe my-pipe               # ng g p
ng generate service my-service         # ng g s
ng generate class my-class             # ng g cl
ng generate interface my-interface     # ng g i
ng generate enum my-enum               # ng g e
ng generate module my-module           # ng g m
ng generate guard my-guard             # ng g g
ng generate interceptor my-interceptor
ng generate resolver my-resolver
ng generate pipe my-pipe
ng generate web-worker my-worker
ng generate library my-lib             # for Angular workspace libraries
ng generate application my-app         # add another app to workspace
```

List all available schematics:
```bash
ng generate --help
```

---

## Building

### `ng build`
Compiles the app into an output directory (default `dist/`).

```bash
ng build
```

Flags:
```bash
ng build --configuration=production   # (-c) prod build (default since v12 for `ng build` w/o flag it's actually prod by default now)
ng build --output-path=dist/custom    # custom output folder
ng build --base-href=/my-app/         # set base href
ng build --watch                      # rebuild on file changes
ng build --stats-json                 # generate stats.json for bundle analysis
ng build --source-map                 # generate source maps
ng build --aot                        # Ahead-of-Time compilation (default)
```

---

## Testing

### `ng test`
Runs unit tests (Karma/Jasmine by default, or Jest/Web Test Runner depending on setup).

```bash
ng test
```

Flags:
```bash
ng test --watch=false        # run once, don't watch
ng test --code-coverage      # generate coverage report
ng test --browsers=ChromeHeadless
```

### `ng e2e`
Runs end-to-end tests (requires e2e tooling like Cypress/Playwright to be configured).

```bash
ng e2e
```

---

## Linting

### `ng lint`
Runs configured linter (ESLint, if set up).

```bash
ng lint
ng lint --fix
```

---

## Code Quality / Analysis

### `ng build --stats-json` + Webpack Bundle Analyzer
```bash
npm install -g webpack-bundle-analyzer
ng build --stats-json
webpack-bundle-analyzer dist/my-app/stats.json
```

---

## Adding Packages / Angular Ecosystem Libraries

### `ng add`
Downloads and installs an Angular-aware package and runs its setup schematic.

```bash
ng add @angular/material
ng add @angular/pwa
ng add @angular/fire
ng add @ngrx/store
```

### `ng update`
Updates the workspace and dependencies to new versions, including migration scripts.

```bash
ng update                       # check for updates
ng update @angular/core @angular/cli   # update Angular core + CLI
ng update --all                 # update all dependencies
ng update --force                # force update (dependency mismatches)
```

The official recommended path for major version upgrades is [update.angular.io](https://update.angular.io), which tells you the exact commands for your current → target version.

---

## Workspace / Config Management

### `ng config`
Reads or sets values in `angular.json`.

```bash
ng config                                   # print whole config
ng config schematics.@schematics/angular:component.style scss
ng config -g cli.packageManager pnpm        # set global CLI config
```

### `ng doc`
Opens Angular documentation search in your browser for a keyword.

```bash
ng doc router
```

---

## Deployment

### `ng deploy`
Deploys the app (requires a deploy schematic added, e.g. Firebase, GitHub Pages, Netlify).

```bash
ng add angular-cli-ghpages   # example: GitHub Pages
ng deploy
```

---

## Extracting i18n

### `ng extract-i18n`
Extracts marked translatable text (`i18n` attributes) into a translation source file.

```bash
ng extract-i18n
ng extract-i18n --output-path=src/locale --format=xlf2
```

---

## Cache Management

Angular CLI caches build results to speed up rebuilds.

```bash
ng cache info      # show cache status
ng cache clean      # clear the cache
ng cache disable
ng cache enable
```

---

## Version & Help

```bash
ng version          # (ng v) — Angular, CLI, Node, package versions
ng help              # list all commands
ng <command> --help  # detailed help for any command
```

---

## Quick Cheat Sheet (Most Used Day-to-Day)

| Task | Command |
|---|---|
| New project | `ng new my-app` |
| Start dev server | `ng serve -o` |
| Generate component | `ng g c my-component` |
| Generate service | `ng g s my-service` |
| Build for prod | `ng build -c production` |
| Run unit tests | `ng test` |
| Lint code | `ng lint` |
| Add a library | `ng add @angular/material` |
| Update Angular | `ng update @angular/core @angular/cli` |
| Check version | `ng version` |

---

### Notes
- Since Angular v17+, `ng new` defaults to **standalone components** (no NgModules needed) unless you pass `--no-standalone`.
- Most `generate` commands accept `--dry-run` to preview file changes without writing them.
- Command aliases (`ng g`, `ng c` for component, `ng s` for service, etc.) save typing — use `ng generate --help` to see the full alias list for your installed CLI version, since it occasionally changes between major releases.

# nc_adminpanel_vue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Note: Before getting started, please create a .env file

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).水电费

## Project Setup

```sh
yarn install
```

### Compile and Hot-Reload for Development

**Development mode (connect to dev API):**

```sh
yarn dev
```

**Mock mode (use local mock data):**

```sh
yarn dev:mock
```

### Type-Check, Compile and Minify for Production

**Build for development environment:**

```sh
yarn build:dev
```

**Build for staging environment:**

```sh
yarn build:staging
```

**Build for production environment:**

```sh
yarn build:prod
```

## Environment Configuration

The project includes four environment configuration files:

| File               | Description             | Usage                         |
| ------------------ | ----------------------- | ----------------------------- |
| `.env.development` | Development environment | `yarn dev` / `yarn build:dev` |
| `.env.mock`        | Mock data mode          | `yarn dev:mock`               |
| `.env.staging`     | Staging environment     | `yarn build:staging`          |
| `.env.production`  | Production environment  | `yarn build:prod`             |

### Configuration Variables

| Variable            | Description                    | Default               |
| ------------------- | ------------------------------ | --------------------- |
| `VITE_PROXY_PATH`   | Proxy path for dev server      | `/api`                |
| `VITE_API_BASE_URL` | Backend API base URL           | Varies by environment |
| `VITE_USE_API_STUB` | Use mock data (`true`/`false`) | `false`               |

**How it works:**

- **Dev server** (`yarn dev`, `yarn dev:mock`): Uses `VITE_PROXY_PATH` (`/api`) and proxies requests to `VITE_API_BASE_URL`
- **Production build** (`yarn build:*`): Uses `VITE_API_BASE_URL` directly

### How to Configure API Base URL

**Step 1:** Open the environment file you want to modify:

- `.env.development` - For development environment
- `.env.staging` - For staging environment
- `.env.production` - For production environment

**Step 2:** Update the `VITE_API_BASE_URL` value:

```env
# Example: .env.production
VITE_API_BASE_URL=https://api.yourdomain.com
```

**Step 3:** Restart dev server or rebuild:

```sh
# If in dev mode, restart
yarn dev

# If building, rebuild
yarn build:prod
```

### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```

## Generate Types from Mock Data

We use [quicktype](https://github.com/quicktype/quicktype) to generate TypeScript type definitions from our mock JSON files.

### Usage

Generate types for a specific JSON file:

```sh
npx quicktype \
  --lang ts \
  --just-types \
  --src src/mocks/data/<file>.json \
  --out src/mocks/types/<file>.ts
```

## Writing Unit Tests with Codex

We use **Codex** to help write unit tests.  
You can generate a test case for a specific file by running the following command:

```sh
/mention src/[filename] unit test
```

## AI TestGent Workflow

This repository includes an AI test generation workflow at `.github/workflows/ai-testgent.yml`.

- It runs automatically on pull requests (`opened`, `synchronize`, `reopened`).
- You can also run it manually from the Actions tab with `Run workflow`.
- Required secret: `LLM_API_KEY` in `Settings -> Secrets and variables -> Actions`.

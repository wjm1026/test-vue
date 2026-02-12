# Repository Guidelines

These guidelines keep contributions predictable across the Vue 3 admin surface and avoid regressions in shared modules.

## Project Structure & Module Organization

- `src/main.ts` boots the Vue 3 app, wiring the router and shared providers.
- Views and route definitions live under `src/views` and `src/router`; keep feature-specific state in colocated Pinia stores.
- Reusable UI and logic modules sit in `src/components`, `src/shared`, and `src/api`.
- Mock JSON data and generated types live in `src/mocks`; run quicktype when schema changes.
- Static assets belong in `public/` or `src/assets/`; end-to-end exercises live in `src/e2e`.
- Unit test examples live in `src/__tests__/examples/`; these are reference templates for AI-assisted test generation.

## Environment & Tooling

- Use Node 20.19+ (or 22.12+) and Yarn 1.22; install dependencies with `yarn install`.
- Enable Volar, ESLint, and Prettier in your editor; husky + lint-staged run lint/format on staged files.
- Environment files (`.env.development`, `.env.mock`, `.env.staging`, `.env.production`) are pre-configured for different deployment modes.

## Build, Test, and Development Commands

- `yarn dev` serves the app with Vite HMR on `http://localhost:8000`.
- `yarn build` runs type-checking plus production compile; follow with `yarn preview` when validating bundles.
- `yarn lint` and `yarn format` apply ESLint + Prettier rules; run them before pushing.
- `yarn test:vitest` (or `:coverage`) runs unit suites; `yarn test:playwright` executes e2e checks; append `:ui` for interactive triage.

## Coding Style & Naming Conventions

- Prefer `<script setup lang="ts">` in `.vue` SFCs; components use PascalCase (e.g., `UserCard.vue`).
- Export composables and helpers in camelCase; enums reside under `src/enum` in SCREAMING_SNAKE_CASE.
- Maintain 2-space indentation, trailing commas, and import ordering enforced by ESLint/Prettier.
- Tailwind utilities are preferred for layout; scope component styles in `<style scoped>` blocks.
- Vue template strings in stubs must avoid nested double quotes inside attribute bindings. For example, prefer `$emit('update:sortOrder', 'desc')` (single quotes) instead of `$emit('update:sortOrder', "desc")` in inline `template` strings to prevent template compilation errors.
- Always render a host/component before querying with Testing Library. When validating `v-model`, use a small host component that actually binds `v-model` and reflects the value in DOM, then query/assert on that reflected state. Do not query elements before calling `render(...)` or before the DOM has been updated.

## Testing Guidelines

- Place unit specs alongside source (`Component.spec.ts`) or under `src/shared/__tests__`.
- Reference examples in `src/__tests__/examples/` when writing new tests; AI should generate tests in the same style, naming convention, and comment style.
- Mock API calls via `src/mocks` and keep fixtures in sync by re-running quicktype.
- Keep e2e scenarios focused and tagged within `src/e2e`; launch Playwright UI with `yarn test:playwright:ui`.
- Ensure new features include happy-path and error coverage; verify coverage before merging.
- **AI-assisted test generation instructions:**
  1. When a file is referenced in chat and the user requests a unit test, AI should:
     1. Place the generated test under `src/__tests__/`.
     2. Include self-contained components or composables when possible.
     3. File names should use kebab-case (all lowercase with words separated by hyphens), UPPER_CASE for constants.
     4. Use English comments describing purpose and assertions.
     5. Cover normal behavior, boundary conditions, and error scenarios.
     6. Follow style and patterns in `src/__tests__/examples/`.
     7. Test code should follow ESLint syntax rules.

## Commit & Pull Request Guidelines

- Follow the short imperative pattern seen in history (e.g., `add husky`, `delete unused code`).
- Reference linked issues in the body and document environment toggles or migrations.
- For UI or API changes, attach screenshots or request/response examples and describe test evidence.
- Confirm `yarn build`, `yarn lint`, and relevant test suites pass before requesting review.

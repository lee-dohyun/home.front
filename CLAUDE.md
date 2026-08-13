# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

`store.front` (repo renamed from `home.front`) is the landing/home frontend for leedohyun.com, part of a small multi-repo
system that also includes `auth.api` (Spring Boot, handles signup/login/logout via an
httpOnly `ACCESS_TOKEN` cookie) and `gateway` (fronts backend services, forwards identity
via `X-User-Id`/`X-User-Role` headers).

**As of this writing, this repo has no integration with `auth.api` or `gateway`.** It is
essentially the unmodified output of `create-next-app` (App Router + TypeScript + Tailwind,
default page/logo/links) plus:
- `app/health/route.ts` — a `GET /health` route returning `{ status: 'ok' }`, used for
  container health checks.
- `next.config.ts` tweaks for deployment (see below).

There are no `fetch`/API client calls, no cookie handling, no auth context/provider, and no
environment variables referencing auth or gateway endpoints anywhere in the codebase. When
adding features that need identity, check `auth.api` and `gateway` for the current contract
(cookie name `ACCESS_TOKEN`, forwarded headers `X-User-Id`/`X-User-Role`) rather than assuming
any existing pattern here — there isn't one yet.

**Gateway whitelist gotcha**: `home.leedohyun.com` is not currently in `gateway`'s
`JwtAuthenticationFilter` `PROTECTED_HOSTS`, so pages here are public by default today. But if this
repo ever adds a host-scoped auth requirement, or if a page here calls a `PROTECTED_HOSTS` domain's API
(e.g. `customer.leedohyun.com/api/auth/**`) that must work pre-login, that path needs its own entry in
`gateway`'s `PUBLIC_EXACT_PATHS`/`PUBLIC_PATH_PREFIXES` — routing config in this repo has no effect on
that decision, the two repos are decoupled. See `gateway/CLAUDE.md`'s "Key implication for changes"
section and the 2026-08-02 `/verify` page incident there for a concrete example of this biting in
`customer.front`.

## Tech stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/postcss`)
- **Package manager**: npm (`package-lock.json` is the lockfile present; no yarn/pnpm lock files)
- **No test framework is configured** — there is no `test` script and no test files/dependencies in `package.json`.

## Commands

```bash
npm install       # install dependencies
npm run dev        # dev server with Turbopack, http://localhost:3000
npm run build       # production build (output: "standalone" per next.config.ts)
npm run start       # run the production build
npm run lint        # next lint (flat config in eslint.config.mjs, extends next/core-web-vitals + next/typescript)
```

There is no test command/framework in this repo; do not assume Jest/Vitest are available.

## Architecture

- **Routing**: Next.js App Router under `app/`. Currently only two routes exist:
  `app/page.tsx` (root `/`, the default create-next-app boilerplate page) and
  `app/health/route.ts` (`/health` API route for health checks). `app/layout.tsx` is the
  root layout, loading Geist Sans/Mono via `next/font/google` and importing `app/globals.css`.
- **State management**: none — no client state library, no React context providers beyond
  the default layout.
- **API calls**: none present anywhere in the app.
- **Styling**: Tailwind v4 imported directly in `app/globals.css` via `@import "tailwindcss"`
  and an `@theme inline` block mapping CSS variables (`--background`, `--foreground`, font
  variables) into Tailwind theme tokens; dark mode handled via
  `@media (prefers-color-scheme: dark)` overriding those CSS variables.
- **Path aliases**: `@/*` maps to the repo root (`tsconfig.json`).
- **Deployment**: `next.config.ts` sets `output: "standalone"` (self-contained server
  output for Docker), disables the `X-Powered-By` header, and whitelists `leedohyun.com`
  as an allowed `next/image` domain. The `Dockerfile` is a multi-stage build (deps → build
  → production) that copies the standalone `.next`, `node_modules`, and `public` into a
  non-root (`nextjs`) user image and runs `npm start`.
- **CI**: `.github/workflows/docker-image.yml` builds the Docker image on every push/PR to
  `main` and pushes it to Docker Hub as `<DOCKERHUB_USERNAME>/store.front:latest` (project
  name is read from `package.json`'s `name` field). No lint/test step runs in CI.

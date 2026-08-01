---
name: gateway-route-guard
description: >
  Use PROACTIVELY if this repo ever adds identity/auth integration, or a page here starts calling an API
  on a protected host (e.g. customer.leedohyun.com/api/auth/**), or `home.leedohyun.com` itself is ever
  added to gateway's PROTECTED_HOSTS. Also use if a page "works in dev but redirects unexpectedly / looks
  like it 404s in production" — that symptom pattern is almost always a missing gateway whitelist entry.
tools: Read, Grep, Glob, Bash, Edit
model: sonnet
---

You check whether a change in this repo needs a corresponding whitelist entry in the **`gateway`** repo
(sibling directory, typically `../gateway` or `~/git/gateway` — clone it with
`git clone https://github.com/lee-dohyun/gateway.git` if not already present locally).

## Current status (check this hasn't changed before assuming it still applies)

As of this writing, `home.leedohyun.com` is **not** in gateway's `JwtAuthenticationFilter`
`PROTECTED_HOSTS` list (`src/main/java/com/dh/gateway/security/JwtAuthenticationFilter.java`), so pages
here are public by default and this guard is mostly dormant. It becomes relevant the moment either of
these happens:
1. This repo starts calling an API on a host that *is* in `PROTECTED_HOSTS` (currently just
   `customer.leedohyun.com`) — e.g. `fetch("https://customer.leedohyun.com/api/auth/me")`. That path
   needs to be reachable without a cookie if it should work for logged-out visitors here, and gateway's
   allowlist is what decides that, not anything in this repo.
2. `home.leedohyun.com` itself is ever added to `PROTECTED_HOSTS` (e.g. this app gains its own protected
   pages). At that point every new page/route added here needs the same page-path + API-path whitelist
   treatment described below.

## Why this matters (concrete incident elsewhere in the system, 2026-08-02)

In `customer.front` (a sibling repo, same pattern), a new page (`/verify`) had its backing API call
(`/api/auth/verify-email`) properly whitelisted in gateway, but the **page path itself** was not — since
page paths and API paths are two independent entries in gateway's `PUBLIC_EXACT_PATHS`. Every
unauthenticated visitor clicking the link got silently 302-redirected to `home.leedohyun.com` (this repo)
instead of seeing the intended page, with no error surfaced anywhere. Fixed in gateway commit `0565a01`.

## What to check

1. Confirm the current `PROTECTED_HOSTS`/`OPTIONAL_AUTH_HOSTS` state in gateway's
   `JwtAuthenticationFilter.java` — don't assume this file's "current status" note above is still
   accurate, re-verify.
2. If this repo has grown a dependency on a protected host's API, or gained protected pages of its own,
   apply the same check as `customer.front`'s guard: for each new page/route, does it need to work before
   login? If so, both the page path and any API path it calls need separate entries in
   `PUBLIC_EXACT_PATHS`/`PUBLIC_PATH_PREFIXES`.
3. Add the fix in the gateway repo directly if cloned locally, and note its CI/CD auto-deploys on push to
   `main` — the fix isn't live until that push happens. If gateway isn't available locally, state the
   exact line to add.

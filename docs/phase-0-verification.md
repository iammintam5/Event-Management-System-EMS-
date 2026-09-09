# Phase 0 verification — 2026-09-09

## Implemented

- Existing Git checkout retained as the monorepo root; pnpm workspace has root,
  `@ems/web`, `@ems/api`, and `@ems/shared` packages.
- Next.js App Router page with a live API health panel, loading/error handling,
  responsive layout, Tailwind CSS and a shadcn-style Button foundation.
- NestJS health endpoint, Swagger, global validation, CORS, environment validation
  and a consistent error contract with no raw database errors.
- Prisma PostgreSQL adapter, lifecycle hooks, client generation, initial SQL migration.
- PostgreSQL and Redis Compose services with persistent volumes and healthchecks.
- Local env generation, shared HTTP contracts, quality scripts and setup documentation.

## Verified successfully

| Check                   | Evidence                                                                        |
| ----------------------- | ------------------------------------------------------------------------------- |
| Dependency installation | `pnpm install`, all 4 workspace projects                                        |
| Prisma client           | `pnpm db:generate`                                                              |
| Prisma schema           | `pnpm db:validate`                                                              |
| Development migration   | `pnpm db:migrate`, applied `20260909000000_initialize_database`, schema in sync |
| TypeScript              | `pnpm typecheck`, all 3 application/shared packages                             |
| Unit tests              | `pnpm test`, 3 suites, 11 tests passed                                          |
| Lint                    | `pnpm lint`, zero errors/warnings after configuration fixes                     |
| Build                   | Shared, NestJS and Next.js production builds                                    |
| Development startup     | Root `pnpm dev` starts both apps; Nest watch compiles without errors            |
| Frontend                | HTTP 200 at `http://localhost:3000`                                             |
| Readiness               | HTTP 200 at `http://localhost:3001/api/health`; PostgreSQL query through Prisma |
| Swagger                 | HTTP 200 at `/api/docs`; health route present in `/api/docs-json`               |
| Error contract / CORS   | Smoke test validates HTTP 404 JSON and allowed frontend origin                  |
| PostgreSQL container    | Healthy; `pg_isready` reports accepting connections                             |
| Redis container         | Healthy; `redis-cli ping` returns `PONG`                                        |
| Env protection          | Git ignores root `.env`, API `.env` and web `.env.local`                        |

Smoke verification is scripted in `scripts/smoke.mjs`. Unit tests check invalid
environment values, dependency failure, validation errors and suppression of internal
exception details. Browser interaction and camera/QR flows are outside this phase.

## Resolved during verification

- Docker Desktop was installed but not running; started its Linux engine.
- Registry downloads needed execution outside the network-restricted sandbox.
- Nest incremental build cache initially remained outside `dist` while output was
  cleared, causing a missing entrypoint on a subsequent start. The build cache now
  lives in `dist/.tsbuildinfo`, so output and cache are invalidated together.
- ESLint now resolves the Next app from `apps/web`; generated `next-env.d.ts` is
  excluded from formatting.

## Remaining exception

**The requested default database host ports have not been verified with EMS.**
An existing PostgreSQL process occupies 5432, and `real_estate_redis` occupies 6379.
They were not stopped. EMS runs locally at **5433 for PostgreSQL and 6380 for Redis**.
Only ignored local env files use these alternate ports; committed examples remain
5432/6379. Web and API use the requested 3000/3001.

To satisfy the port convention fully, free 5432/6379, update both local env files,
run `pnpm db:up` and restart the API, then repeat `pnpm smoke` and container checks.
Do not delete volumes. Until that is done, Phase 0 has this explicit exception to
the original acceptance criteria.

The installer also reports legacy ESLint 9 and a transitive glob deprecation.
ESLint 9 is retained for the installed React lint plugin's declared peer range;
do not upgrade its major independently without checking the Next lint toolchain.
Optional `@parcel/watcher` and telemetry-related `@scarf/scarf` install scripts were
not approved; the verified build and development startup work without them.

## Next phase

Resolve or accept the local port exception before Phase 1. Phase 1 implements users,
JWT access/refresh rotation, logout, event-scoped authorization foundations, and
login/register/protected dashboard UI as a complete vertical feature. No business
features or premature AI/background workers were implemented in Phase 0.

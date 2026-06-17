# Accommodation Manager — Implementation Status

**Date:** 2026-06-15  
**Version:** 0.1.0 (MVP)

---

## Tech Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Runtime | Node.js | 18.20.8 | Requires `--experimental-global-webcrypto` flag |
| Backend | NestJS | 10.x | |
| ORM | TypeORM | 0.3.30 | `synchronize: true` (dev mode) |
| Database | PostgreSQL | 14 (Homebrew) | Local only |
| Frontend | Next.js | 16.2.9 | Custom build — requires Node ≥ 20 via nvm |
| UI | MUI (Material UI) | 9.1.1 | App Router cache provider required |
| Data grid | MUI X DataGrid | 9.5.0 | Community edition |
| HTTP client | Axios | — | REST calls from frontend |

---

## What Is Working

### Backend (NestJS — `http://localhost:3001`)

| Feature | Status | File |
|---------|--------|------|
| Clean Architecture layers (Domain / Application / Infrastructure / Presentation) | ✅ Done | `src/domain/`, `src/application/`, `src/infrastructure/`, `src/presentation/` |
| Domain entities (`Property`, `Bed`, `Resident`, `Booking`) | ✅ Done | `src/domain/*/` |
| TypeORM ORM entities + auto schema sync | ✅ Done | `src/infrastructure/database/typeorm/entities/` |
| Repository pattern (interface in domain, implementation in infrastructure) | ✅ Done | `src/infrastructure/database/typeorm/repositories/` |
| `POST /api/import` — XLSX file upload → parse → upsert DB | ✅ Done | `import.controller.ts`, `import-xlsx.use-case.ts`, `xlsx.parser.ts` |
| `GET /api/dashboard/stats` — KPI counts | ✅ Done | `dashboard.controller.ts`, `get-dashboard-stats.use-case.ts` |
| `GET /api/properties` | ✅ Done | `properties.controller.ts` |
| `GET /api/beds?propertyId=` (includes `propertyCode`) | ✅ Done | `beds.controller.ts` |
| `GET /api/residents` | ✅ Done | `residents.controller.ts` |
| `GET /api/bookings?status=active\|upcoming\|completed` | ✅ Done | `bookings.controller.ts` |
| CORS configured for frontend origin | ✅ Done | `main.ts` |

### Frontend (Next.js — `http://localhost:3000`)

| Feature | Status | File |
|---------|--------|------|
| Responsive layout (permanent sidebar desktop / hamburger + drawer mobile) | ✅ Done | `AppShell.tsx` |
| Active nav link highlight | ✅ Done | `AppShell.tsx` |
| Dashboard — 5 KPI cards (Properties / Total Beds / Occupied / Available / On Radar) | ✅ Done | `dashboard/page.tsx` |
| Dashboard — KPI grid responsive (2 cols mobile → 3 tablet → 5 desktop) | ✅ Done | `dashboard/page.tsx` |
| Dashboard — Beds DataGrid (Bed Code, Status, Resident, Room Type, …) | ✅ Done | `dashboard/page.tsx` |
| Dashboard — XLSX upload (collapsible, triggered by button, auto-closes on success) | ✅ Done | `XlsxUploader.tsx` |
| Properties page — DataGrid | ✅ Done | `properties/page.tsx` |
| Residents page — DataGrid | ✅ Done | `residents/page.tsx` |
| Bookings page — DataGrid + status filter toggle | ✅ Done | `bookings/page.tsx` |
| All tables horizontally scrollable on mobile | ✅ Done | All pages |
| Root `/` redirects to `/dashboard` | ✅ Done | `page.tsx` |
| MUI hydration fix (`AppRouterCacheProvider`) | ✅ Done | `layout.tsx` |

### Infrastructure / DevOps

| Feature | Status | File |
|---------|--------|------|
| `run.sh` — one-command startup script | ✅ Done | `run.sh` |
| Auto-starts PostgreSQL via Homebrew | ✅ Done | `run.sh` |
| Auto-creates `accommodation` DB and `postgres` role | ✅ Done | `run.sh` |
| Auto-installs Node 20 via nvm if Node < 20 detected | ✅ Done | `run.sh` |
| Backend readiness check before starting frontend | ✅ Done | `run.sh` |
| Graceful Ctrl+C shutdown of both processes | ✅ Done | `run.sh` |

---

## Known Limitations

### XLSX Import
- **Placeholder rows are skipped**: rows where the resident name is `"Resident Full Name"` or email is `"email"` are treated as empty and no booking is created. Only rows with real resident names produce a booking.
- **No duplicate prevention for residents**: each import creates new `Resident` rows even if the name already exists. Re-importing the same file adds new resident records and deletes/recreates bookings. Properties and Beds are upserted (safe to re-import).
- **Formula cells are not evaluated**: cells with Excel formulas (e.g. `=VLOOKUP(...)`) are read as their string formula, not the computed value. The `Due` column (rent due date from VLOOKUP) is always skipped for this reason.
- **Only the `Control` sheet is read**: other sheets in the workbook are ignored.

### Backend
- **`synchronize: true`** in TypeORM is active — schema is auto-updated on every restart. Not safe for production (use migrations instead).
- **No authentication or authorisation** — all API endpoints are public.
- **No pagination** on any list endpoint — returns all records. Will degrade with large datasets.
- **No input validation** on API endpoints (no `class-validator` DTOs on requests).
- **No error handling middleware** — unhandled errors return a 500 with raw stack trace.
- **`nest start` (not `--watch`)** is used in `run.sh` — backend does not hot-reload on code changes. Run `npm run start:dev` manually in the backend folder for watch mode.

### Frontend
- **No loading skeletons** — pages show empty tables while data loads.
- **No error state UI** — if the backend is unreachable, the page silently shows 0 / empty.
- **No create / edit / delete** on any entity — the app is read-only (data comes only from XLSX import).
- **DataGrid is Community edition** — no column pinning, no row grouping, no export.
- **`Sidebar.tsx`** is an unused file (superseded by `AppShell.tsx`) — can be deleted.

### Environment
- **macOS / Homebrew only** — `run.sh` uses `brew services` and assumes the macOS username as the PostgreSQL owner. Needs adaptation for Linux or Docker.
- **Node 18 workaround** — `NODE_OPTIONS=--experimental-global-webcrypto` is injected to work around `@nestjs/typeorm` using `globalThis.crypto` which is only stable in Node 19+. Switching to Node 20 removes the need for this flag.
- **No `.env` override in script** — the `run.sh` exports DB env vars that override the `backend/.env` file to use the OS username for Homebrew PostgreSQL (no password). The `.env` file still contains `DB_USER=postgres / DB_PASSWORD=postgres` which only works if you have a `postgres` role with that password configured.

---

## Database — Current State

| Table | Row count |
|-------|-----------|
| properties | 15 |
| beds | 15 |
| residents | 413 |
| bookings | 17 |

> **Note:** High resident count (413) relative to bed count (15) is expected when the same XLSX is imported multiple times — residents are always inserted (not upserted), so each import adds new rows.

### Reset command
```bash
psql -U "$(whoami)" -d accommodation -c \
  "TRUNCATE bookings, residents, beds, properties RESTART IDENTITY CASCADE;"
```

---

## Not Yet Implemented

| Feature | Priority | Notes |
|---------|----------|-------|
| Create / Edit / Delete for Properties, Beds, Residents, Bookings via UI | High | Currently only importable via XLSX |
| Resident deduplication on import (upsert by email or personalId) | High | Currently duplicates on re-import |
| Authentication (login / JWT / roles) | High | All endpoints public |
| Input validation on API endpoints | Medium | Add `class-validator` + `ValidationPipe` |
| Proper DB migrations (replace `synchronize: true`) | Medium | Required before any staging/prod deployment |
| Pagination on list endpoints | Medium | `GET /api/residents` can be large |
| Error handling UI (loading spinners, empty states, error banners) | Medium | |
| Unit and integration tests | Medium | No tests exist |
| Docker / Docker Compose setup | Low | Currently macOS-only |
| Production build + deployment config | Low | No CI/CD, no Dockerfile |
| Dark mode | Low | |
| Export to CSV / Excel from the UI | Low | |

---

## File Map

```
acomodationManagerSystem/
├── run.sh                          ← one-command start script
├── docs/
│   ├── entities.md                 ← entity ER + field reference
│   └── implementation-status.md   ← this file
├── backend/
│   ├── .env                        ← DB connection defaults
│   └── src/
│       ├── domain/                 ← pure entities + repository interfaces
│       ├── application/            ← use cases + DTOs
│       ├── infrastructure/
│       │   ├── database/           ← TypeORM entities + repositories
│       │   └── parsers/xlsx.parser.ts
│       └── presentation/controllers/
└── frontend/
    └── src/
        ├── app/                    ← Next.js App Router pages
        ├── components/
        │   ├── layout/AppShell.tsx ← responsive sidebar / mobile nav
        │   ├── dashboard/StatsCard.tsx
        │   └── upload/XlsxUploader.tsx
        └── services/api.ts         ← typed API client
```

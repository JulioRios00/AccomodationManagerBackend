# UC-102 — Bedroom Layout & Bed Pricing: Verification Report

**Date:** 2026-08-01 (re-verified)
**Verdict:** ✅ Fully implemented, backend + frontend. Nothing to build. Work is **uncommitted** on `main`.

> An earlier version of this document claimed the frontend was missing. That was based on a stale
> directory listing and was wrong — corrected below against the current working tree.

---

## UC-102 flow → implementation

| Flow step | Status | Where |
|---|---|---|
| 1. Admin selects a Property and chooses "Manage Inventory" | ✅ | `frontend/src/app/properties/page.tsx:68` — row action → `/properties/{id}/inventory` |
| 2. Creates individual Bedroom units ("Room 1A", "Room 1B") | ✅ | `app/properties/[id]/inventory/page.tsx` + `components/crud/BedroomDialog.tsx`; `POST /api/bedrooms` |
| 3. Adds Bed assets within each room with layout location | ✅ | `BedDialog.tsx` — Bedroom select + "Location / Layout Name" (`Bed.name`) + "Position" (`Bed.position`) |
| 4. Sets a rental price per individual bed | ✅ | `BedDialog.tsx` Rent (€) → `Bed.rentAmount`, decimal(10,2), guarded `>= 0` |
| 5. Saves layout; beds become Vacant / Unallocated | ✅ | `save-bed.use-case.ts:47` forces `status: 'vacant'` on create; DB column default `'vacant'` |
| Precondition: property profile must exist | ✅ | `save-bedroom.use-case.ts` → 404 if `propertyId` doesn't resolve |

---

## Backend detail

| Item | Status | File |
|---|---|---|
| `Bedroom` domain entity + repository | ✅ | `domain/bedroom/` |
| TypeORM entity, repo, `findByPropertyAndName` | ✅ | `infrastructure/database/typeorm/.../bedroom.*` |
| `GET/POST/PUT/DELETE /api/bedrooms` with `@Roles('sysadmin','manager')` | ✅ | `presentation/controllers/bedrooms.controller.ts` |
| Soft delete bedroom | ✅ | `delete-bedroom.use-case.ts` |
| `Bed.bedroomId` / `name` / `position` / `status` | ✅ | `domain/bed/bed.entity.ts`, `bed.orm-entity.ts` |
| Blank bedroom name → 400 | ✅ | `save-bedroom.use-case.ts` |
| Duplicate bedroom name in same property → 409 | ✅ | `save-bedroom.use-case.ts` |
| Bedroom must belong to the bed's property → 400 | ✅ | `save-bed.use-case.ts` |
| Negative rent / deposit → 400 | ✅ | `save-bed.use-case.ts` |
| `bedroomName` joined onto bed reads | ✅ | `bed.typeorm-repository.ts:17,65` (`relations: ['property','bedroom']`) |
| **Status lifecycle** — booking sets `allocated` | ✅ | `save-booking.use-case.ts:70` |
| **Status lifecycle** — checkout resets `vacant` | ✅ | `checkout.use-case.ts:69` |
| **Status lifecycle** — booking delete resets `vacant` | ✅ | `delete-booking.use-case.ts:20` |

## Frontend detail

| Item | Status | File |
|---|---|---|
| `Bedroom` type + `getBedrooms` / `createBedroom` / `updateBedroom` / `deleteBedroom` | ✅ | `services/api.ts:308, 479–484` |
| `Bed` type carries `bedroomId`, `bedroomName`, `name`, `position`, `status` | ✅ | `services/api.ts:318–325` |
| Inventory page: bedroom cards, per-room bed tables, unassigned-beds section | ✅ | `app/properties/[id]/inventory/page.tsx` |
| Status chip (Vacant / Allocated) | ✅ | inventory page + `BedDialog` title chip |
| Write actions gated by `can('bed:write')` / `can('property:write')` | ✅ | inventory page, mirrors backend `@Roles` |
| Beds grid shows Bedroom / Location / Status columns | ✅ | `app/beds/page.tsx:54–57` |
| Status shown read-only in BedDialog ("managed automatically") | ✅ | `BedDialog.tsx` |

**Bonus beyond UC-102:** the inventory page also manages `PropertySpace` / `SpaceItem` (kitchen, bathroom, living room furnishings) — a separate feature riding on the same screen.

---

## Verification run

- `npx tsc --noEmit` in `backend/` → **exit 0**, zero type errors.

---

## Remaining housekeeping (not UC-102 functionality)

1. **The work is uncommitted.** `git status` shows the whole UC-102 frontend (`app/properties/[id]/inventory/`, `BedroomDialog.tsx`) as untracked and the backend use-cases as modified, on `main`. The last commit is `00c94cf9 Merge feat/uc-401-occupancy-dashboard`. Commit it before anything else — a `git checkout` would destroy it.
2. `docs/implementation-status.md` is dated 2026-06-15 and materially wrong — it still says the app is read-only with no create/edit/delete, no auth, and 4 entities. Regenerate it.
3. Optional polish: bedroom soft-delete doesn't warn when the room still holds beds; deleted rooms leave their beds in the "Unassigned" bucket. Add a confirm-with-count message if that's undesirable.

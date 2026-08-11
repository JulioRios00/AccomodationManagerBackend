# UC-101 — Onboard a New Property Complex: Gap Analysis + Plan

**Date:** 2026-08-01
**Verdict:** ~80% implemented. Backend is complete; **three fields are unreachable from the UI**.

---

## UC-101 flow → implementation

| Flow step | Status | Evidence |
|---|---|---|
| **Precondition** — staff authenticated with Administration+ privileges | ⚠️ | Global `ClerkAuthGuard` + `RolesGuard` (`app.module.ts:119–120`). Works, but see **G4** — the `administrator` role is *not* allowed to create properties |
| 1. Navigate to Property Management, click "Add Property" | ✅ | `app/properties/page.tsx:97–99`, gated by `can('property:write')` |
| 2a. Address | ✅ | `fullAddress` (text) + `area` |
| 2b. **EirCode** | ❌ | Backend has it; **absent from `services/api.ts` `Property` type and from `PropertyDialog`** |
| 2c. **Property Type** | ❌ | Same — backend column exists, no UI field |
| 2d. Full description | ✅ | `salesDescription` — multiline field under "Sales Description" |
| 3a. MPRN / GPRN | ✅ | `electricityMprn`, `gasGprn` fields; **cross-property uniqueness enforced** in `save-property.use-case.ts` → 400 |
| 3b. ISP details | ✅ | Full "Internet / Broadband" section: supplier, account, email, username, password, payment type, status, contract end date, portal link, phone, notes |
| 3c. Access hardware — master lock codes | ✅ | `keyCode`, plus `electricityKeypadCode`, `gasPin` |
| 3c. Access hardware — **Fob IDs** | ⚠️ | Only `fobCount` (an integer). No per-fob identifiers anywhere; `KeyLog` tracks issuance events, not a fob asset registry |
| 4. Landlord banking IBAN/BIC + payment milestone dates | ⚠️ | The data model is complete — `Landlord.iban`, `bic`, `payoutDay`, `residentPaymentDueDay`, all editable in `LandlordDialog`. But **`Property.landlordId` has no selector in any UI**, so a property can never be linked to its landlord |
| 5. Save → unique system Property ID | ✅ | UUID PK (`@PrimaryGeneratedColumn('uuid')`) + `code` has a DB `UNIQUE` constraint |

---

## Gaps

| # | Gap | Severity |
|---|---|---|
| **G1** | `eirCode` and `propertyType` missing from the frontend `Property` interface (`services/api.ts:70–112`) and from `PropertyDialog` | **High** — an explicit UC-101 requirement |
| **G2** | No landlord selector on `PropertyDialog`; `landlordId` is in the form's `empty` state (line 28) but has no input. Grep confirms nothing in the frontend ever sets it | **High** — blocks flow step 4 and any property→landlord payment reporting |
| **G3** | No Fob ID registry — only a count | **Medium** — depends on whether "Fob IDs" means individual serials or just quantity |
| **G4** | Role mismatch: UC says "Administration or higher", but `administrator` has only `resident:edit`. Property creation requires `sysadmin` or `manager` | **Medium** — naming/policy decision, not a bug |
| **G5** | No format validation on `eirCode` (Irish Eircode is `A65 F4E2` style) and `propertyType` is a free string with no enum | Low |

---

## Plan

Branch: `feat/uc-101-property-fields`

### Phase A — Frontend field exposure (≈1.5h)

**A1. `services/api.ts`** — add to `interface Property`:
```ts
eirCode: string | null;
propertyType: string | null;
```

**A2. `components/crud/PropertyDialog.tsx`**
- Add both to the `empty` FormState.
- In the always-visible basic block, add:
  - `EirCode` text field (uppercase on blur, `maxLength 10` to match the varchar(10) column).
  - `Property Type` select — `House`, `Apartment`, `Duplex`, `Studio Block`, `Other` (define the list as a const so it can be reused).
- Layout: the basic grid is currently `3/3/3/3` then `8/4`. Make it `3/3/3/3` → `Full Address (xs 6)` / `EirCode (xs 3)` / `Property Type (xs 3)` → `Admin Email (xs 4)`.

**A3. Landlord link** (closes G2)
- `PropertyDialog` takes a new `landlords: Landlord[]` prop.
- Add a "Landlord & Payments" accordion containing:
  - `Landlord` select (`landlordId`, `None` option allowed).
  - Read-only summary of the selected landlord's IBAN / BIC / Payout Day / Resident Due Day, with a note that they're edited on the Landlords page. This satisfies step 4 without duplicating the banking fields on two screens.
- `app/properties/page.tsx` loads `getLandlords()` alongside `getProperties()` and passes it down.

**A4. Properties grid** — add `EirCode` and `Type` columns; add `Landlord` column resolved from the landlords list.

### Phase B — Backend validation (≈1h)

- `save-property.use-case.ts`: normalise `eirCode` (trim + uppercase, strip inner spaces before compare); reject values longer than 10 chars → 400.
- Validate `propertyType` against the allowed enum → 400 on unknown value. Keep `null` acceptable.
- If `landlordId` is supplied, inject `ILandlordRepository` and 404 if it doesn't resolve (same pattern already used in `save-bedroom.use-case.ts`).

### Phase C — Fob registry (optional, ≈2.5h) — only if "Fob IDs" means individual serials

Decide first. If yes:
- New `PropertyAccessDevice` entity: `id`, `propertyId`, `type` (`fob` | `key` | `remote`), `identifier`, `notes`, `active`.
- Repository + `GET/POST/PUT/DELETE /api/properties/:id/access-devices` with `@Roles('sysadmin','manager')`.
- Surface it in the existing inventory page (`app/properties/[id]/inventory/page.tsx`) as a third section next to Bedrooms and Spaces — that screen already has the card/table pattern to copy.
- Keep `fobCount` as a derived display, or drop it once the registry is populated.

If no — the current counts satisfy the UC and this phase is skipped.

### Phase D — Role policy (≈0.5h)

Decide whether the UC's "Administration" means the `administrator` role or `manager`. If `administrator` should onboard properties:
- `frontend/src/lib/permissions.ts` → add `'property:write'` (and likely `'bed:write'`) to `administrator`.
- Add `'administrator'` to the `@Roles(...)` on `properties.controller.ts` (and `bedrooms.controller.ts` / `beds.controller.ts` to stay consistent).
- Both sides must change together or the UI will show buttons that 403.

### Phase E — Verification (≈1h)

1. `npx tsc --noEmit` in `backend/` and `frontend/` — zero errors.
2. Create a property through the UI with every UC-101 field populated; reload and confirm all values persist.
3. Negative: duplicate MPRN → 400 with the conflicting property code; duplicate GPRN → 400; bad `propertyType` → 400.
4. Confirm a `staff`-role user sees no "Add Property" button and gets 403 from a direct `POST /api/properties`.

---

## Estimate

| Phase | Time |
|---|---|
| A — Frontend fields + landlord link | 1.5h |
| B — Backend validation | 1h |
| C — Fob registry (optional) | 2.5h |
| D — Role policy | 0.5h |
| E — Verification | 1h |
| Buffer | 3h |
| **Total** | **7h** (4.5h without Phase C) |

---

## Prompt for Claude Code

> Implement the UC-101 gaps described in `docs/uc-101-gap-plan.md`, phases A, B and E, on branch `feat/uc-101-property-fields`.
> The backend already has `eirCode`, `propertyType`, `landlordId` and MPRN/GPRN uniqueness — do not re-add them.
> The work is exposing those fields in `services/api.ts` and `PropertyDialog.tsx`, wiring the landlord selector, and adding the input validation.
> Skip Phase C and Phase D — they need a product decision first.
> Run `npx tsc --noEmit` in both `backend/` and `frontend/` before declaring done.

---

## Note

UC-101/102 work is still **uncommitted** on `main` (see `docs/uc-102-gap-plan.md`). Commit before starting a new branch.

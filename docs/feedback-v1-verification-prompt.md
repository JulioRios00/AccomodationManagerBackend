# Verification Prompt — Lucas Feedback v1

Paste everything below the line into Claude Code from the repo root.

---

## Task

Verify, item by item, which of the 40+ improvement suggestions below are **already implemented**, **partially implemented**, or **missing** in this codebase. Do **not** write any application code. Produce a single report at `docs/feedback-v1-status.md`.

## Repo context

- Backend: NestJS + TypeORM, clean architecture, in `backend/src/`
  - `domain/<entity>/` — entities + repository interfaces
  - `application/use-cases/` — business logic
  - `infrastructure/database/typeorm/` — ORM entities + repositories
  - `presentation/controllers/` — REST controllers, `@Roles(...)` guards
- Frontend: Next.js App Router + MUI, in `frontend/src/`
  - `app/<route>/page.tsx` — screens
  - `components/crud/*Dialog.tsx` — create/edit forms
  - `services/api.ts` — typed API client + all TS interfaces
  - `lib/permissions.ts` — role → action map
- Auth: Clerk, global `ClerkAuthGuard` + `RolesGuard`. Roles: `sysadmin`, `manager`, `administrator`, `staff`.
- Existing analyses you can trust as a starting point (but re-verify anything you cite): `docs/uc-101-gap-plan.md`, `docs/uc-102-gap-plan.md`. Treat `docs/implementation-status.md` as **stale and unreliable** — it is dated 2026-06-15 and describes a read-only app that no longer exists.
- A large amount of work is currently **uncommitted** on `main`. Verify against the working tree, not against git history.

## Method — follow this exactly

1. Read the relevant `page.tsx`, `*Dialog.tsx`, `services/api.ts` interface, domain entity, ORM entity, and use-case for each area before judging it.
2. Judge only on what the code does today. Do not credit an item because the data model supports it — if a field exists in the database but has no UI, that is **Partial**, and the report must say "data model yes, UI no."
3. Cite `path/to/file.ts:line` as evidence for every verdict. A verdict with no citation is not acceptable.
4. Where an item is a **design question** rather than a feature (marked ❓ below), do not guess the answer — describe the current behaviour, list the constraints the code imposes, and state what decision is needed.
5. Do not fix anything. This pass is read-only.

## Output format

`docs/feedback-v1-status.md`, one table per section:

| # | Suggestion | Verdict | Evidence | Notes / effort |
|---|---|---|---|---|

Verdicts: ✅ Implemented · 🟡 Partial · ❌ Missing · ❓ Design decision needed.
Effort: S (<2h), M (2–8h), L (>8h), plus a one-line reason for anything L.

End the report with:
- **Quick wins** — every ❌/🟡 that is S, in a single list. These are the "do it this week" items.
- **Needs a decision before coding** — every ❓, with the specific question to put to Lucas/Bruno.
- **Structural** — the L items, with a note on what else each one touches.

---

## Items to verify

### 1. Dashboard — `frontend/src/app/dashboard/page.tsx`

- **1.1** Is the label "Beds" or "Units"? (Note: item 3.2 argues for "Bedspaces" instead — flag the naming conflict, don't resolve it.)
- **1.2** Do the KPI card / status icon colours match the status semantics — Occupied = green, Available = orange, On Radar = red? Report the actual colours used, and check consistency with the status chips on `/beds` and the inventory page.
- **1.3** Clicking a status KPI card — does it filter the list below by that status? Check for any onClick/filter state on the cards.
- **1.4** Does the grid show **Check-out date** alongside Check-in and Contract End? Check both the DataGrid columns and whether `checkOutDate` is present on the booking payload reaching the frontend.

### 2. Properties — `frontend/src/app/properties/page.tsx`

- **2.1** ❓ Is there any concept of switching between business units (Mach, AAI, Gallagher)? Report: how `bu` is stored and used today, whether it's a per-row column or a filter, and whether anything in the auth/tenant layer could scope data per BU. Note that "one server per BU" vs "BU switcher in-app" is an architecture decision — state the trade-off, don't pick.
- **2.2** Which columns does the properties grid show today? Specifically: are Electricity and Gas status exposed as grid columns/filters, and are resident payment date and landlord payment date exposed anywhere? Also check whether a filter or report exists that can select properties by electricity/gas payment type (e.g. all pre-pay meters).
- **2.3** Is there a total / subtotal count of properties displayed anywhere on the page?

### 3. Beds — `frontend/src/app/beds/page.tsx`, `components/crud/BedDialog.tsx`, `backend/src/domain/bed/`

- **3.1** Same naming question as 1.1 — report where the "Bed" label appears across the UI (page title, nav item, column headers, dialog titles) so the rename scope is known.
- **3.2** ❓ **Most important item in this list.** Verify how the bed model handles reconfiguration:
  - Is `bedNumber` unique per property? Is it used as an identity key anywhere (bed code display, XLSX import matching, bookings)?
  - What happens today if a bed is deleted — soft or hard delete? What happens to its historical bookings?
  - Can a bed be deactivated rather than deleted? Is `active` respected in queries?
  - Does anything model a bed's *type/capacity* (single vs double) separately from the bed record? Check `bedSize`, `bedroomType`.
  - Report whether Bruno's proposal is feasible against the current schema: each bedroom pre-provisioned with fixed bedspaces (3 singles + 1 double with left/right slots), activated/deactivated per configuration. State exactly what would have to change — entity fields, unique constraints, the XLSX importer's matching logic, and any place that assumes a stable bed code.
- **3.3** Is a rent **Due Date** column present on the beds grid? Check whether due-date data even reaches that view (it may live on `RentPayment` or `Landlord.residentPaymentDueDay`).

### 4. Residents — `frontend/src/app/residents/page.tsx`, `components/crud/ResidentDialog.tsx`

- **4.1** Can you see which property a resident is currently allocated to, from the residents list? Is there a null/"unallocated" state shown? Check whether the residents endpoint joins the active booking.
- **4.2** Is there a check-out / archive page listing all past residents? Note: `checkout.use-case.ts` and a `CheckoutRecord` entity exist — verify whether any **UI** surfaces them, and what fields the record captures.
- **4.3** Does the resident model store immigration document expiry (IRP / GNIB / passport)? Is there any expiry warning or blocking rule on renewal?
- **4.4** Is there any file/image attachment capability — upload, or a link field pointing at Google Shared Drive? Check the resident entity, the dialog, and whether the backend has any file-storage handling beyond the XLSX import upload.

### 5. Bookings — `frontend/src/app/bookings/page.tsx`

- **5.1** ❓ Clarify what "Bookings" models today: is it a licence agreement / tenancy (resident occupying a bed for a date range), or a property viewing appointment? Read `domain/booking/booking.entity.ts` and `save-booking.use-case.ts` and state plainly which it is. Lucas assumed viewings; if it's actually tenancies, the correct answer may be that **viewings are an entirely new entity**, not a rename. Say so.
- **5.2** Is there any record of a viewing's responsible staff member, date and time? If bookings are tenancies, report this as missing rather than partial.

### 6. Landlords — `frontend/src/app/landlords/page.tsx`, `components/crud/LandlordDialog.tsx`

- **6.1** Is there a phone number field on the landlord entity and in the dialog/grid?
- **6.2** Is `Property.landlordId` settable from any UI? (Prior analysis says no — confirm and cite.) Also check whether any view shows a landlord's properties.

### 7. Service Providers — `frontend/src/app/service-providers/page.tsx`

- **7.1** Does the service provider entity carry payment/financial details (IBAN, BIC, payment terms, rates)?
- **7.2** Can you see the maintenance history for a given provider? Check whether `MaintenanceTicket` links to a provider and whether any UI filters by it.

### 8. Maintenance — `frontend/src/app/maintenance/page.tsx`, `components/crud/MaintenanceTicketDialog.tsx`

- **8.1** Field order in the dialog — does Property come before Title?
- **8.2** Are there fields for **assignee/responsible** and **request date**? Distinguish `createdAt` from an explicit user-entered request date.
- **8.3** Is there a subtotal/count display that reacts to the active filters?
- **8.4** Is there any report export for maintenance (CSV/XLSX)? Note: `reports.controller.ts` has a delinquency CSV export — check whether the same pattern covers maintenance, and report how reusable it is.

### 9. Key Log — `frontend/src/app/key-logs/page.tsx`

- **9.1** Is the property **code** shown (not just an ID)?
- **9.2** Is there a "date key collected" field? `takenAt` may already cover this — check the column label and whether it's displayed.

### 10. Payments — `frontend/src/app/payments/page.tsx`

- **10.1** ❓ How are monthly receivables created today — generated automatically, imported from XLSX, or entered manually? Read `import-resident-payments.use-case.ts`, `save-rent-payment.use-case.ts` and `add-rent-installment.use-case.ts`. Describe the actual lifecycle and where a monthly generation job would have to hook in. Do not propose a design; describe what exists.
- **10.2** Is there a property column on the payments grid?
- **10.3** Is there a paid-date column?
- **10.4** Are deposits separated into deposits **payable** (refunds out) and deposits **received** (in)? Check `DepositTransaction.type` and how the UI groups it.
- **10.5** Is there a monthly subtotal showing amount due-to-date vs received-to-date?
- **10.6** Can payments be grouped/sorted by due day and property, with a pending-only filter? Report what sorting and filtering the grid supports today.

### 11. Reports — `frontend/src/app/reports/page.tsx`, `backend/src/presentation/controllers/reports.controller.ts`

- **11.1** ❓ What report capability exists today? List every report endpoint and every export. Then assess feasibility of Bruno's custom report builder — user picks fields, filters, sort order; reports are private or shared; reports can be locked against edits. Specifically report:
  - whether the current architecture (fixed use-case per report) could host a generic query builder, or whether it needs a new data-access layer;
  - what a saved-report entity would need (owner, visibility, locked flag, field/filter/sort definition);
  - whether the operational vs managerial split maps onto anything already present.
  Flag this as L and explain what it touches.

### 12. Data importing — `backend/src/infrastructure/parsers/`, `import.controller.ts`

- **12.1** ❓ Is there any SignRequest (e-signature) integration? Almost certainly not — so instead report: what the current import path is, how a booking's status transitions between upcoming/active/completed today (`get-bookings.use-case.ts`), and whether those transitions are computed from dates or stored. That determines how hard a "contract signed → booking active → check-in date → booking live" webhook flow would be.

### 13. GDPR & Taxes Consolidation Act 1997 compliance

- **13.1** Is there any data retention, purge, or anonymisation mechanism? Check for scheduled jobs, soft-delete semantics, and whether anything tracks when a resident became inactive.
- **13.2** Is there tiered access — are inactive/checked-out residents restricted to `manager`/`sysadmin`? Read `lib/permissions.ts` and the `@Roles` decorators across controllers and report the current access matrix as a table.
- **13.3** Is there any partial-anonymisation capability (strip all personal data except name)? Check whether the resident entity separates identifying fields in a way that would make this feasible.
- For all three: note that `AuditLog` exists (`domain/audit-log/`) — report whether it is actually written to anywhere, since retention work depends on it.

---

## Final instruction

Be blunt about what is missing. An inflated ✅ count is worse than useless here — this report is going to be used to plan the next sprint, and a wrong "already done" costs more than a wrong "missing." If you are unsure about an item, mark it 🟡 and say precisely what you could not determine.

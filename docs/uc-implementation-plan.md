# Use Case Implementation Plan

**Project:** Accommodation Manager System  
**Date:** 2026-07-20  
**Author:** Julio Rios  

---

## Overview

This document covers the incremental implementation of business rules UC-101 through UC-402.  
Each use case is delivered on its own Git branch, merged into `main` only after a clean build and successful verification on both local and production environments.

All time estimates include:
- Implementation (coding + local build verification)
- Local environment testing (run.sh, manual endpoint verification)
- Production deployment and verification (Render redeploy + live URL checks)
- A fixed 3-hour buffer per use case to absorb unexpected issues (TypeORM schema drift, Render cold-start delays, edge cases)

---

## Branch Strategy

```
main
 ├── feat/uc-101-property-onboarding     → merge → main
 ├── feat/uc-102-bedroom-inventory       → merge → main
 ├── feat/uc-201-licence-overlap         → merge → main
 ├── feat/uc-301-ticket-category         → merge → main
 ├── feat/uc-302-fcfs-queue              → merge → main
 ├── feat/uc-401-occupancy-dashboard     → merge → main
 ├── feat/uc-501-accounts-receivable     → merge → main
 ├── feat/uc-502-landlord-confirm        → merge → main
 ├── feat/uc-601-deposit-refund          → merge → main
 └── feat/uc-402-report-builder          → merge → main
```

Merge gate: `npm run build` must pass with zero errors before any merge.

---

## Use Cases

---

### UC-101 — Property Onboarding

**Branch:** `feat/uc-101-property-onboarding`

**Business rule:**  
Property creation must enforce unique MPRN and GPRN values across active properties. Two new identification fields — EirCode and Property Type — are required on the Property record.

**Files to change:**

| File | Change |
|---|---|
| `domain/property/property.entity.ts` | Add `eirCode: string \| null`, `propertyType: string \| null` |
| `domain/property/property.repository.ts` | Add `findByMprn(mprn)` and `findByGprn(gprn)` to interface |
| `infrastructure/.../property.orm-entity.ts` | Add `eirCode` (varchar 10) and `propertyType` (varchar 50) columns |
| `infrastructure/.../property.typeorm-repository.ts` | Implement `findByMprn`, `findByGprn`; map new fields in `toDomain` |
| `application/use-cases/save-property.use-case.ts` | Add `eirCode`, `propertyType` to DTO; add `validateUniqueness()` private method checking MPRN/GPRN conflicts |

**Validation rules:**
- On create and update: if `electricityMprn` is provided, no other active property may have the same value → `400 Bad Request`
- Same rule for `gasGprn`
- Property `code` uniqueness is already enforced at the database level (`UNIQUE` constraint)

**Time estimate:**

| Phase | Time |
|---|---|
| Implementation | 1.5h |
| Local testing | 0.5h |
| Production verification | 0.5h |
| Buffer | 3h |
| **Total** | **5.5h** |

---

### UC-102 — Bedroom and Bed Inventory

**Branch:** `feat/uc-102-bedroom-inventory`

**Business rule:**  
Properties contain Bedrooms; Bedrooms contain Beds. Each Bed carries a name, a position, and a status (vacant by default). Monthly rent cannot be negative.

**New entity: `Bedroom`**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `propertyId` | UUID FK | Required |
| `name` | varchar(100) | Required |
| `active` | boolean | Soft delete |
| `createdAt` / `updatedAt` | timestamp | Auto |

**New fields on `Bed`:**

| Field | Type | Notes |
|---|---|---|
| `bedroomId` | UUID FK (nullable) | Links to Bedroom; nullable for backward compatibility with existing beds |
| `name` | varchar(100, nullable) | Human label for the bed |
| `position` | int (nullable) | Physical position in the bedroom |
| `status` | varchar(20) | `vacant` (default) or `allocated` |

**Files to create:**

| File | Purpose |
|---|---|
| `domain/bedroom/bedroom.entity.ts` | Domain entity |
| `domain/bedroom/bedroom.repository.ts` | Repository interface + token |
| `infrastructure/.../bedroom.orm-entity.ts` | TypeORM entity |
| `infrastructure/.../bedroom.typeorm-repository.ts` | TypeORM implementation |
| `application/use-cases/get-bedrooms.use-case.ts` | List by propertyId |
| `application/use-cases/save-bedroom.use-case.ts` | Create / update |
| `application/use-cases/delete-bedroom.use-case.ts` | Soft delete |
| `presentation/controllers/bedrooms.controller.ts` | `GET/POST/PUT/DELETE /api/bedrooms` |

**Files to modify:**

| File | Change |
|---|---|
| `domain/bed/bed.entity.ts` | Add `bedroomId`, `name`, `position`, `status` |
| `infrastructure/.../bed.orm-entity.ts` | Add columns; add nullable FK relation to BedroomOrmEntity |
| `infrastructure/.../bed.typeorm-repository.ts` | Map new fields in `toDomain` |
| `application/use-cases/save-bed.use-case.ts` | Add `bedroomId`, `name`, `position`, `status` to DTO; guard `rentAmount >= 0` and `depositAmount >= 0` |
| `infrastructure/database/database.module.ts` | Register `BedroomOrmEntity` and `BedroomTypeOrmRepository` |
| `app.module.ts` | Register `BedroomsController`, `GetBedroomsUseCase`, `SaveBedroomUseCase`, `DeleteBedroomUseCase` |

**API endpoints added:**

```
GET    /api/bedrooms?propertyId=       List bedrooms (filter by property)
POST   /api/bedrooms                   Create bedroom   [sysadmin, manager]
PUT    /api/bedrooms/:id               Update bedroom   [sysadmin, manager]
DELETE /api/bedrooms/:id               Soft delete      [sysadmin, manager]
```

**Time estimate:**

| Phase | Time |
|---|---|
| Implementation | 3h |
| Local testing | 1h |
| Production verification | 0.5h |
| Buffer | 3h |
| **Total** | **7.5h** |

---

### UC-201 — Licence Agreement

**Branch:** `feat/uc-201-licence-overlap`

**Business rule:**  
When creating or updating a booking (licence agreement), the system must:
1. Confirm the resident exists
2. Confirm the bed exists
3. Confirm the licence start date is before the end date
4. Reject any booking that overlaps an existing active booking on the same bed

**Overlap definition** — two bookings overlap when:
```
existing.checkInDate < new.endDate  AND  (existing.checkOutDate OR existing.contractEndDate) > new.startDate
```

**Files to modify:**

| File | Change |
|---|---|
| `domain/booking/booking.repository.ts` | Add `findOverlappingActive(bedId, startDate, endDate, excludeId?)` |
| `infrastructure/.../booking.typeorm-repository.ts` | Implement via QueryBuilder with date range condition |
| `application/use-cases/save-booking.use-case.ts` | Inject `IBedRepository` and `IResidentRepository`; run existence checks and overlap check before saving |

**Error responses:**

| Condition | HTTP | Message |
|---|---|---|
| Resident not found | 404 | `Resident {id} not found` |
| Bed not found | 404 | `Bed {id} not found` |
| Start ≥ end | 400 | `Licence start date must be before end date` |
| Overlapping booking found | 400 | `Bed is already allocated during the selected period (conflicts with booking {id})` |

**Time estimate:**

| Phase | Time |
|---|---|
| Implementation | 2h |
| Local testing | 1h |
| Production verification | 0.5h |
| Buffer | 3h |
| **Total** | **6.5h** |

---

### UC-301 — Maintenance Ticket Creation

**Branch:** `feat/uc-301-ticket-category`

**Business rule:**  
Maintenance tickets must carry a category (`plumbing`, `electrical`, `internet`, `other`) and support optional links to the specific bed and resident that raised the issue. These fields enable auto-population of context when a ticket is created from a resident-facing flow.

**Files to modify:**

| File | Change |
|---|---|
| `domain/maintenance-ticket/maintenance-ticket.entity.ts` | Add `category: TicketCategory \| null`, `bedId: string \| null`, `residentId: string \| null` |
| `infrastructure/.../maintenance-ticket.orm-entity.ts` | Add `category` (varchar 30), `bedId` (uuid nullable), `residentId` (uuid nullable) columns |
| `infrastructure/.../maintenance-ticket.typeorm-repository.ts` | Map new fields in `toDomain` |
| `application/use-cases/save-maintenance-ticket.use-case.ts` | Add `category`, `bedId`, `residentId` to `SaveMaintenanceTicketDto` |

**Valid category values:** `plumbing` · `electrical` · `internet` · `other`

**Time estimate:**

| Phase | Time |
|---|---|
| Implementation | 1h |
| Local testing | 0.5h |
| Production verification | 0.5h |
| Buffer | 3h |
| **Total** | **5h** |

---

### UC-302 — FCFS Ticket Queue

**Branch:** `feat/uc-302-fcfs-queue`

**Business rule:**  
Open tickets must be processed in strict First-Come-First-Served order. An operator claims the next ticket (locking it so no two operators can claim the same one simultaneously). Closing a ticket requires resolution notes and logs the event.

**Files to create:**

| File | Purpose |
|---|---|
| `application/use-cases/claim-ticket.use-case.ts` | Pessimistic write lock via TypeORM transaction; sets status → `in_progress`; logs activity |
| `application/use-cases/close-ticket.use-case.ts` | Sets status → `completed`; stores resolution notes in `descriptionDone`; logs activity |

**Files to modify:**

| File | Change |
|---|---|
| `domain/maintenance-ticket/maintenance-ticket.repository.ts` | Add `findQueue(): Promise<MaintenanceTicket[]>` |
| `infrastructure/.../maintenance-ticket.typeorm-repository.ts` | Implement `findQueue()` — `WHERE status = 'open' ORDER BY createdAt ASC` |
| `presentation/controllers/maintenance-tickets.controller.ts` | Add three new endpoints (below) |
| `app.module.ts` | Register `ClaimTicketUseCase`, `CloseTicketUseCase` |

**API endpoints added:**

```
GET  /api/maintenance-tickets/queue       Open tickets, oldest first
POST /api/maintenance-tickets/:id/claim   Claim ticket (lock)   [sysadmin, manager, administrator]
POST /api/maintenance-tickets/:id/close   Close ticket          [sysadmin, manager, administrator]
  Body: { "resolutionNotes": "string" }
```

**Concurrency control:**  
`ClaimTicketUseCase` wraps the read-and-update in a `dataSource.transaction()` with `lock: { mode: 'pessimistic_write' }`. If the ticket is already `in_progress` or `completed` when the lock is acquired, a `400 Bad Request` is returned.

**Time estimate:**

| Phase | Time |
|---|---|
| Implementation | 2.5h |
| Local testing | 1h |
| Production verification | 0.5h |
| Buffer | 3h |
| **Total** | **7h** |

---

### UC-401 — Occupancy Dashboard

**Branch:** `feat/uc-401-occupancy-dashboard`

**Business rule:**  
The dashboard must dynamically compute and return occupancy rate, current monthly revenue (sum of active bookings), and projected revenue (active + upcoming bookings). No values are stored — all are calculated at query time.

**Files to modify:**

| File | Change |
|---|---|
| `application/dto/dashboard-stats.dto.ts` | Add `occupancyRate: number`, `monthlyRevenue: number`, `projectedRevenue: number` |
| `application/use-cases/get-dashboard-stats.use-case.ts` | Fetch upcoming bookings in parallel; compute three new metrics |

**New metric definitions:**

| Metric | Formula |
|---|---|
| `occupancyRate` | `(occupiedBeds / totalBeds) * 100`, rounded to 1 decimal |
| `monthlyRevenue` | Sum of `rentAmount` across all active bookings |
| `projectedRevenue` | Sum of `rentAmount` across active + upcoming bookings |

**Time estimate:**

| Phase | Time |
|---|---|
| Implementation | 1h |
| Local testing | 0.5h |
| Production verification | 0.5h |
| Buffer | 3h |
| **Total** | **5h** |

---

### UC-501 — Accounts Receivable

**Branch:** `feat/uc-501-accounts-receivable`

**Business rule:**  
Rent payment invoices have a lifecycle: `pending` → `received` (when fully paid) or `overdue`. A daily scheduled job finds overdue invoices and sends a reminder email at D+1 and an urgent reminder at D+4. Notifications are deduped — a given invoice is never notified twice at the same stage. Administrators can edit the email templates via API.

**New entity: `EmailTemplate`**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `type` | varchar(30) | `delinquency_d1` or `delinquency_d4` |
| `subject` | varchar(200) | Email subject line |
| `bodyHtml` | text | HTML email body |
| `bodyText` | text | Plain-text fallback |
| `active` | boolean | Soft delete |
| `createdAt` / `updatedAt` | timestamp | Auto |

**New fields on `RentPayment`:**

| Field | Type | Notes |
|---|---|---|
| `invoiceStatus` | varchar(20) | `pending` (default), `received`, `overdue` |
| `notifiedD1At` | timestamp (nullable) | Set when D+1 email is sent (prevents re-send) |
| `notifiedD4At` | timestamp (nullable) | Set when D+4 email is sent (prevents re-send) |

**Files to create:**

| File | Purpose |
|---|---|
| `domain/email-template/email-template.entity.ts` | Domain entity |
| `domain/email-template/email-template.repository.ts` | Repository interface + token |
| `infrastructure/.../email-template.orm-entity.ts` | TypeORM entity |
| `infrastructure/.../email-template.typeorm-repository.ts` | TypeORM implementation |
| `application/use-cases/get-email-templates.use-case.ts` | List templates |
| `application/use-cases/save-email-template.use-case.ts` | Create / update |
| `presentation/controllers/email-templates.controller.ts` | `GET/POST/PUT /api/email-templates` |
| `infrastructure/notifications/notification.service.ts` | Sends email via nodemailer (SMTP); logs to console in dev when `SMTP_HOST` is absent |
| `infrastructure/notifications/delinquency-notification.scheduler.ts` | `@Cron('0 8 * * *')` — runs daily at 08:00 UTC; finds overdue payments; sends D+1 / D+4 emails; sets `notifiedD1At` / `notifiedD4At` |

**Files to modify:**

| File | Change |
|---|---|
| `domain/rent-payment/rent-payment.entity.ts` | Add `invoiceStatus`, `notifiedD1At`, `notifiedD4At` |
| `infrastructure/.../rent-payment.orm-entity.ts` | Add three columns |
| `infrastructure/.../rent-payment.typeorm-repository.ts` | Map new fields in `toDomain`; add `findOverdueUnnotified(stage: 'd1'\|'d4')` |
| `application/use-cases/save-rent-payment.use-case.ts` | Auto-set `invoiceStatus = 'received'` when `amountPaid >= rentAmount` |
| `infrastructure/database/database.module.ts` | Register `EmailTemplateOrmEntity` and repository |
| `app.module.ts` | Import `ScheduleModule.forRoot()`; register scheduler, `NotificationService`, `EmailTemplatesController` use-cases |

**API endpoints added:**

```
GET  /api/email-templates              List all templates
POST /api/email-templates              Create template   [sysadmin, manager]
PUT  /api/email-templates/:id          Update template   [sysadmin, manager]
```

**Required environment variables (production):**

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=notifications@example.com
SMTP_PASS=secret
SMTP_FROM="AccomManager <notifications@example.com>"
```

If `SMTP_HOST` is not set, `NotificationService` logs the email to the console instead of sending (safe for local dev).

**Time estimate:**

| Phase | Time |
|---|---|
| Implementation | 5h |
| Local testing | 1.5h |
| Production verification | 1h |
| Buffer | 3h |
| **Total** | **10.5h** |

---

### UC-502 — Landlord Payments

**Branch:** `feat/uc-502-landlord-confirm`

**Business rule:**  
When a landlord payment is confirmed (`status` set to `paid`), an immutable timestamp (`confirmedAt`) is recorded. Once set, `confirmedAt` cannot be cleared or overwritten by subsequent updates.

**Files to modify:**

| File | Change |
|---|---|
| `domain/landlord-payment/landlord-payment.entity.ts` | Add `confirmedAt: Date \| null` |
| `infrastructure/.../landlord-payment.orm-entity.ts` | Add `confirmedAt` (timestamp, nullable) column |
| `infrastructure/.../landlord-payment.typeorm-repository.ts` | Map `confirmedAt` in `toDomain` |
| `application/use-cases/save-landlord-payment.use-case.ts` | On update: if incoming `status === 'paid'` and existing `confirmedAt` is null → set `confirmedAt = new Date()`. If `confirmedAt` is already set, preserve it regardless of what the caller sends |

**Time estimate:**

| Phase | Time |
|---|---|
| Implementation | 1h |
| Local testing | 0.5h |
| Production verification | 0.5h |
| Buffer | 3h |
| **Total** | **5h** |

---

### UC-601 — Deposit Refund

**Branch:** `feat/uc-601-deposit-refund`

**Business rule:**  
After checkout inspection, the system automatically calculates a 5-business-day refund deadline (skipping Saturdays and Sundays). Administration can mark the refund as completed, which records an immutable timestamp and an audit log entry.

**New fields on `DepositTransaction`:**

| Field | Type | Notes |
|---|---|---|
| `checkoutCompletedAt` | timestamp (nullable) | Set by `CheckoutUseCase` when checkout is processed |
| `refundDeadline` | date (nullable) | `checkoutCompletedAt` + 5 business days |
| `refundCompletedAt` | timestamp (nullable) | Set by `CompleteRefundUseCase`; immutable once set |

**Files to create:**

| File | Purpose |
|---|---|
| `application/use-cases/complete-refund.use-case.ts` | Sets `status = 'completed'`, `refundCompletedAt = now()`; writes `AuditLog` entry |
| `infrastructure/date/business-days.util.ts` | `addBusinessDays(date, n)` — skips Saturday/Sunday |

**Files to modify:**

| File | Change |
|---|---|
| `domain/deposit-transaction/deposit-transaction.entity.ts` | Add three new fields |
| `infrastructure/.../deposit-transaction.orm-entity.ts` | Add three columns |
| `infrastructure/.../deposit-transaction.typeorm-repository.ts` | Map new fields in `toDomain` |
| `application/use-cases/checkout.use-case.ts` | Set `checkoutCompletedAt` and `refundDeadline` when auto-creating the refund `DepositTransaction` |
| `presentation/controllers/deposit-transactions.controller.ts` | Add `POST /api/deposit-transactions/:id/complete-refund` |
| `app.module.ts` | Register `CompleteRefundUseCase` |

**API endpoint added:**

```
POST /api/deposit-transactions/:id/complete-refund   [sysadmin, manager]
```

**Time estimate:**

| Phase | Time |
|---|---|
| Implementation | 2.5h |
| Local testing | 1h |
| Production verification | 0.5h |
| Buffer | 3h |
| **Total** | **7h** |

---

### UC-402 — Dynamic Report Builder

**Branch:** `feat/uc-402-report-builder`

**Business rule:**  
A generic reporting engine that allows dynamic selection of entity, fields, filters (AND/OR), sort order, and pagination. Supports preview mode (JSON) and export to CSV and Excel. Every export is logged with user, timestamp, entity, filters, and format.

**New entity: `ReportLog`**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `entityType` | varchar(50) | e.g. `properties`, `residents`, `rent-payments` |
| `fields` | text | JSON-serialised field list |
| `filters` | text | JSON-serialised filter expression |
| `format` | varchar(10) | `json`, `csv`, `excel` |
| `clerkUserId` | varchar(100, nullable) | Who ran the report |
| `clerkUserName` | varchar(200, nullable) | Display name |
| `createdAt` | timestamp | Auto |

**Supported entities for querying:** `properties` · `residents` · `bookings` · `rent-payments` · `landlord-payments` · `maintenance-tickets`

**Filter schema (request body):**
```json
{
  "entityType": "rent-payments",
  "fields": ["residentId", "month", "rentAmount", "invoiceStatus"],
  "filters": {
    "op": "AND",
    "conditions": [
      { "field": "invoiceStatus", "operator": "eq", "value": "overdue" },
      { "field": "month", "operator": "gte", "value": "2026-01" }
    ]
  },
  "sort": { "field": "month", "direction": "DESC" },
  "page": 1,
  "pageSize": 50,
  "format": "json"
}
```

**Supported filter operators:** `eq` · `neq` · `gt` · `gte` · `lt` · `lte` · `like` · `in`

**Files to create:**

| File | Purpose |
|---|---|
| `domain/report-log/report-log.entity.ts` | Domain entity |
| `domain/report-log/report-log.repository.ts` | Interface + token |
| `infrastructure/.../report-log.orm-entity.ts` | TypeORM entity |
| `infrastructure/.../report-log.typeorm-repository.ts` | TypeORM implementation |
| `application/services/report-builder.service.ts` | Builds TypeORM queries dynamically; returns paginated results |
| `application/services/report-export.service.ts` | Converts result set to CSV buffer or Excel `Workbook` via `exceljs` |
| `application/use-cases/build-report.use-case.ts` | Orchestrates builder + logger |
| `presentation/controllers/report-builder.controller.ts` | Two endpoints (below) |

**API endpoints added:**

```
POST /api/reports/build     Preview (JSON response)   [all authenticated]
POST /api/reports/export    Download (CSV or Excel)   [all authenticated]
```

**Files to modify:**

| File | Change |
|---|---|
| `infrastructure/database/database.module.ts` | Register `ReportLogOrmEntity` and repository |
| `app.module.ts` | Register `ReportBuilderService`, `ReportExportService`, `BuildReportUseCase`, `ReportBuilderController` |

**Time estimate:**

| Phase | Time |
|---|---|
| Implementation | 6h |
| Local testing | 2h |
| Production verification | 1h |
| Buffer | 3h |
| **Total** | **12h** |

---

## Summary

| # | Branch | Total |
|---|---|---|
| 1 | UC-101 — Property Onboarding | 5.5h |
| 2 | UC-102 — Bedroom Inventory | 7.5h |
| 3 | UC-201 — Licence Overlap | 6.5h |
| 4 | UC-301 — Ticket Category | 5h |
| 5 | UC-302 — FCFS Queue | 7h |
| 6 | UC-401 — Occupancy Dashboard | 5h |
| 7 | UC-501 — Accounts Receivable | 10.5h |
| 8 | UC-502 — Landlord Confirm | 5h |
| 9 | UC-601 — Deposit Refund | 7h |
| 10 | UC-402 — Report Builder | 12h |
| | **Grand total** | **70.5h** |

---

## Dependencies and Prerequisites

| Item | Required for | Notes |
|---|---|---|
| `@nestjs/schedule` installed | UC-501 | Already added to `package.json` |
| `nodemailer` installed | UC-501 | Already added to `package.json` |
| `exceljs` installed | UC-402 | Already added to `package.json` |
| `SMTP_*` env vars on Render | UC-501 prod test | Without these, scheduler logs to console |
| Stash `wip: mid-session UC-101 through UC-501 partial` | All | Apply only if a branch needs partial work from the stash |

---

## Merge Checklist (per branch)

- [ ] All modified files compile: `cd backend && npm run build`
- [ ] New endpoints tested locally via run.sh
- [ ] Edge cases verified (duplicate values, invalid dates, concurrent requests where applicable)
- [ ] Branch pushed to origin
- [ ] PR opened, build passes
- [ ] Merged into main
- [ ] Render redeploys successfully
- [ ] Live endpoint verified on `accommodation-manager-backend.onrender.com`

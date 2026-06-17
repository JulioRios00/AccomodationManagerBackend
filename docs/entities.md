# Accommodation Manager — Entity Data Structure

## Overview

The data model has four core entities derived from the `ACCOMMODATION CONTROL` spreadsheet.
Each row in the spreadsheet represents a **Bed** within a **Property**, with an active **Resident** linked via a **Booking**.
A bed may also have an upcoming (temporary) resident represented as a second `Booking` with `isTemporary = true`.

---

## Entity Relationship Diagram

```
Property (1) ──────────── (N) Bed
                                │
                                │ (1)
                                │
                              (N) Booking (N) ──── (1) Resident
```

---

## 1. Property

Represents a physical accommodation unit (apartment / house).

| Field | DB Column | Type | Constraints | Description |
|-------|-----------|------|-------------|-------------|
| id | id | UUID | PK | Auto-generated UUID |
| code | code | VARCHAR(20) | UNIQUE, NOT NULL | Property identifier (e.g. `61RR`) — from column A |
| bu | bu | VARCHAR(20) | NOT NULL | Business Unit (e.g. `SA`) — from column B |
| area | area | VARCHAR(100) | NULLABLE | Area / neighbourhood — from column C |
| fullAddress | full_address | TEXT | NULLABLE | Full postal address — from column D |
| officeKeys | office_keys | BOOLEAN | DEFAULT false | Whether office holds a copy of keys — from column E |
| keysCount | keys_count | INT | DEFAULT 0 | Number of resident keys — from column F |
| securityKeysCount | security_keys_count | INT | DEFAULT 0 | Security keys (Sec K) — from column G |
| fobCount | fob_count | INT | DEFAULT 0 | Electronic fob count — from column H |
| electricityStatus | electricity_status | VARCHAR(20) | NULLABLE | e.g. `Pre`, `Active` — from column I |
| gasStatus | gas_status | VARCHAR(20) | NULLABLE | e.g. `Pre`, `Active` — from column J |
| createdAt | created_at | TIMESTAMP | AUTO | Record creation timestamp |
| updatedAt | updated_at | TIMESTAMP | AUTO | Last update timestamp |

---

## 2. Bed

Represents an individual bed within a property. One property has many beds.

| Field | DB Column | Type | Constraints | Description |
|-------|-----------|------|-------------|-------------|
| id | id | UUID | PK | Auto-generated UUID |
| propertyId | property_id | UUID | FK→Property, NOT NULL | Parent property |
| bedNumber | bed_number | INT | NOT NULL | Bed number within the property — from column K |
| bedroomType | bedroom_type | VARCHAR(50) | NOT NULL | Room type: `Twin`, `Single`, `Triple`, `Twin Studio` — from column L |
| sex | sex | VARCHAR(10) | NOT NULL | Gender allocation: `M`, `F` — from column M |
| bedSize | bed_size | VARCHAR(20) | NOT NULL | Bed size: `Single`, `Double` — from column N |
| depositAmount | deposit_amount | DECIMAL(10,2) | DEFAULT 0 | Standard deposit in € — from column P |
| rentAmount | rent_amount | DECIMAL(10,2) | DEFAULT 0 | Monthly rent in € — from column Q |
| createdAt | created_at | TIMESTAMP | AUTO | |
| updatedAt | updated_at | TIMESTAMP | AUTO | |

**Unique constraint:** `(propertyId, bedNumber)` — no duplicate bed numbers within the same property.

---

## 3. Resident

Represents a person who lives or has lived in a bed.

| Field | DB Column | Type | Constraints | Description |
|-------|-----------|------|-------------|-------------|
| id | id | UUID | PK | Auto-generated UUID |
| fullName | full_name | VARCHAR(200) | NOT NULL | Full name — from column R |
| email | email | VARCHAR(200) | NULLABLE | Email address — from column S |
| telephone | telephone | VARCHAR(50) | NULLABLE | Mobile/phone number — from column T |
| nationality | nationality | VARCHAR(100) | NULLABLE | Nationality — from column U |
| personalId | personal_id | VARCHAR(100) | NULLABLE | Passport, NIF, or other ID — from column V |
| iban | iban | VARCHAR(50) | NULLABLE | Bank IBAN for payments — from column W |
| emergencyContact | emergency_contact | TEXT | NULLABLE | Emergency contact name + mobile — from column X |
| source | source | VARCHAR(100) | NULLABLE | Lead / referral source — from column Y |
| createdAt | created_at | TIMESTAMP | AUTO | |
| updatedAt | updated_at | TIMESTAMP | AUTO | |

---

## 4. Booking

Represents a lease contract: links a **Resident** to a **Bed** for a date range.
A bed can have at most one `active` booking and at most one `upcoming` booking simultaneously.

| Field | DB Column | Type | Constraints | Description |
|-------|-----------|------|-------------|-------------|
| id | id | UUID | PK | Auto-generated UUID |
| bedId | bed_id | UUID | FK→Bed, NOT NULL | The booked bed |
| residentId | resident_id | UUID | FK→Resident, NOT NULL | The resident |
| checkInDate | check_in_date | DATE | NULLABLE | Actual check-in date — from column AA |
| contractEndDate | contract_end_date | DATE | NULLABLE | Agreed contract end date — from column AB |
| checkOutDate | check_out_date | DATE | NULLABLE | Actual or planned check-out — from column AC |
| depositAmount | deposit_amount | DECIMAL(10,2) | DEFAULT 0 | Agreed deposit for this booking — from column P / AH |
| rentAmount | rent_amount | DECIMAL(10,2) | DEFAULT 0 | Agreed rent for this booking — from column Q / AI |
| isHeadResident | is_head_resident | BOOLEAN | DEFAULT false | Whether resident is the head tenant — from column Z / AR |
| isTemporary | is_temporary | BOOLEAN | DEFAULT false | `true` = upcoming/next resident (columns AH–AT) |
| status | status | ENUM | NOT NULL | `active` / `upcoming` / `completed` |
| comments | comments | TEXT | NULLABLE | Notes on the booking — from column AE |
| createdAt | created_at | TIMESTAMP | AUTO | |
| updatedAt | updated_at | TIMESTAMP | AUTO | |

### Status values

| Status | Meaning |
|--------|---------|
| `active` | Current resident in place |
| `upcoming` | Next resident booked (temporary booking from columns AH–AT) |
| `completed` | Resident has checked out |

---

## Spreadsheet Column → Entity Mapping

| Excel Col | Header | Entity.Field |
|-----------|--------|--------------|
| A | Code | Property.code |
| B | BU | Property.bu |
| C | Area | Property.area |
| D | Full Address | Property.fullAddress |
| E | OfficeKeys | Property.officeKeys |
| F | Keys | Property.keysCount |
| G | Sec K | Property.securityKeysCount |
| H | Fob | Property.fobCount |
| I | Elec | Property.electricityStatus |
| J | Gas | Property.gasStatus |
| K | Bed | Bed.bedNumber |
| L | Bedroom | Bed.bedroomType |
| M | Sex | Bed.sex |
| N | Bed (size) | Bed.bedSize |
| P | Deposit | Bed.depositAmount / Booking.depositAmount |
| Q | Rent | Bed.rentAmount / Booking.rentAmount |
| R | Resident | Resident.fullName |
| S | E-mail | Resident.email |
| T | Telephone | Resident.telephone |
| U | Nationality | Resident.nationality |
| V | Personal ID | Resident.personalId |
| W | IBAN | Resident.iban |
| X | Emergency Contact | Resident.emergencyContact |
| Y | Source | Resident.source |
| Z | HeadResident | Booking.isHeadResident |
| AA | Check-in | Booking.checkInDate |
| AB | ContractEnd | Booking.contractEndDate |
| AC | Check-out | Booking.checkOutDate |
| AE | Comments | Booking.comments |
| AH | Deposit (temp) | Booking.depositAmount (isTemporary=true) |
| AI | Rent (temp) | Booking.rentAmount (isTemporary=true) |
| AJ | Resident (temp) | Resident.fullName (temp booking) |
| AK–AP | Resident details (temp) | Resident.* (temp booking) |
| AR | HeadResident (temp) | Booking.isHeadResident (isTemporary=true) |
| AS | Check-in (temp) | Booking.checkInDate (isTemporary=true) |
| AT | ContractEnd (temp) | Booking.contractEndDate (isTemporary=true) |

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const bed_orm_entity_1 = require("./bed.orm-entity");
const resident_orm_entity_1 = require("./resident.orm-entity");
let BookingOrmEntity = class BookingOrmEntity {
};
exports.BookingOrmEntity = BookingOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BookingOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BookingOrmEntity.prototype, "bedId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BookingOrmEntity.prototype, "residentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], BookingOrmEntity.prototype, "checkInDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], BookingOrmEntity.prototype, "contractEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], BookingOrmEntity.prototype, "checkOutDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BookingOrmEntity.prototype, "depositAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BookingOrmEntity.prototype, "rentAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], BookingOrmEntity.prototype, "isHeadResident", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], BookingOrmEntity.prototype, "isTemporary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['active', 'upcoming', 'completed'], default: 'active' }),
    __metadata("design:type", String)
], BookingOrmEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BookingOrmEntity.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], BookingOrmEntity.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BookingOrmEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BookingOrmEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bed_orm_entity_1.BedOrmEntity, (bed) => bed.bookings),
    __metadata("design:type", bed_orm_entity_1.BedOrmEntity)
], BookingOrmEntity.prototype, "bed", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => resident_orm_entity_1.ResidentOrmEntity, (resident) => resident.bookings),
    __metadata("design:type", resident_orm_entity_1.ResidentOrmEntity)
], BookingOrmEntity.prototype, "resident", void 0);
exports.BookingOrmEntity = BookingOrmEntity = __decorate([
    (0, typeorm_1.Entity)('bookings')
], BookingOrmEntity);
//# sourceMappingURL=booking.orm-entity.js.map
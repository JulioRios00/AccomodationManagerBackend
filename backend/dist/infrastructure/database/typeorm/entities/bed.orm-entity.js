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
exports.BedOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const property_orm_entity_1 = require("./property.orm-entity");
const booking_orm_entity_1 = require("./booking.orm-entity");
let BedOrmEntity = class BedOrmEntity {
};
exports.BedOrmEntity = BedOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BedOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BedOrmEntity.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], BedOrmEntity.prototype, "bedNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], BedOrmEntity.prototype, "bedroomType", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10 }),
    __metadata("design:type", String)
], BedOrmEntity.prototype, "sex", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], BedOrmEntity.prototype, "bedSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BedOrmEntity.prototype, "depositAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BedOrmEntity.prototype, "rentAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], BedOrmEntity.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BedOrmEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BedOrmEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_orm_entity_1.PropertyOrmEntity, (property) => property.beds),
    __metadata("design:type", property_orm_entity_1.PropertyOrmEntity)
], BedOrmEntity.prototype, "property", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_orm_entity_1.BookingOrmEntity, (booking) => booking.bed),
    __metadata("design:type", Array)
], BedOrmEntity.prototype, "bookings", void 0);
exports.BedOrmEntity = BedOrmEntity = __decorate([
    (0, typeorm_1.Entity)('beds')
], BedOrmEntity);
//# sourceMappingURL=bed.orm-entity.js.map
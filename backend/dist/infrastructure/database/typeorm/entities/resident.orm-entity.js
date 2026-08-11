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
exports.ResidentOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const booking_orm_entity_1 = require("./booking.orm-entity");
let ResidentOrmEntity = class ResidentOrmEntity {
};
exports.ResidentOrmEntity = ResidentOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ResidentOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, nullable: true, unique: true }),
    __metadata("design:type", String)
], ResidentOrmEntity.prototype, "clerkUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], ResidentOrmEntity.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, nullable: true }),
    __metadata("design:type", String)
], ResidentOrmEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], ResidentOrmEntity.prototype, "telephone", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], ResidentOrmEntity.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], ResidentOrmEntity.prototype, "nationality", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], ResidentOrmEntity.prototype, "personalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], ResidentOrmEntity.prototype, "iban", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ResidentOrmEntity.prototype, "emergencyContact", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], ResidentOrmEntity.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'int' }),
    __metadata("design:type", Number)
], ResidentOrmEntity.prototype, "paymentDueDay", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ResidentOrmEntity.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ResidentOrmEntity.prototype, "delinquent", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ResidentOrmEntity.prototype, "hasObservation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ResidentOrmEntity.prototype, "observation", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], ResidentOrmEntity.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ResidentOrmEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ResidentOrmEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_orm_entity_1.BookingOrmEntity, (booking) => booking.resident),
    __metadata("design:type", Array)
], ResidentOrmEntity.prototype, "bookings", void 0);
exports.ResidentOrmEntity = ResidentOrmEntity = __decorate([
    (0, typeorm_1.Entity)('residents')
], ResidentOrmEntity);
//# sourceMappingURL=resident.orm-entity.js.map
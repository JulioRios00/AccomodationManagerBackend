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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveBookingUseCase = void 0;
const common_1 = require("@nestjs/common");
const booking_repository_1 = require("../../domain/booking/booking.repository");
let SaveBookingUseCase = class SaveBookingUseCase {
    constructor(repo) {
        this.repo = repo;
    }
    async execute(dto) {
        if (dto.id) {
            const existing = await this.repo.findById(dto.id);
            if (!existing)
                throw new common_1.NotFoundException(`Booking ${dto.id} not found`);
        }
        return this.repo.save({
            ...dto,
            checkInDate: dto.checkInDate ? new Date(dto.checkInDate) : null,
            contractEndDate: dto.contractEndDate ? new Date(dto.contractEndDate) : null,
            checkOutDate: dto.checkOutDate ? new Date(dto.checkOutDate) : null,
        });
    }
};
exports.SaveBookingUseCase = SaveBookingUseCase;
exports.SaveBookingUseCase = SaveBookingUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(booking_repository_1.BOOKING_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], SaveBookingUseCase);
//# sourceMappingURL=save-booking.use-case.js.map
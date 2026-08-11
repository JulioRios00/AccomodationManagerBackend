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
exports.GetBedsUseCase = void 0;
const common_1 = require("@nestjs/common");
const bed_repository_1 = require("../../domain/bed/bed.repository");
const booking_repository_1 = require("../../domain/booking/booking.repository");
let GetBedsUseCase = class GetBedsUseCase {
    constructor(bedRepo, bookingRepo) {
        this.bedRepo = bedRepo;
        this.bookingRepo = bookingRepo;
    }
    async execute(propertyId) {
        const beds = await this.bedRepo.findAll(propertyId);
        const activeBookings = await this.bookingRepo.findAll('active');
        const bookingByBed = new Map(activeBookings.map((b) => [b.bedId, b]));
        return beds.map((bed) => ({
            ...bed,
            status: bookingByBed.has(bed.id) ? 'allocated' : 'vacant',
            activeBooking: bookingByBed.get(bed.id) ?? null,
        }));
    }
};
exports.GetBedsUseCase = GetBedsUseCase;
exports.GetBedsUseCase = GetBedsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(bed_repository_1.BED_REPOSITORY)),
    __param(1, (0, common_1.Inject)(booking_repository_1.BOOKING_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object])
], GetBedsUseCase);
//# sourceMappingURL=get-beds.use-case.js.map
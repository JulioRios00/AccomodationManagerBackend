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
exports.ImportXlsxUseCase = void 0;
const common_1 = require("@nestjs/common");
const xlsx_parser_1 = require("../../infrastructure/parsers/xlsx.parser");
const property_repository_1 = require("../../domain/property/property.repository");
const bed_repository_1 = require("../../domain/bed/bed.repository");
const resident_repository_1 = require("../../domain/resident/resident.repository");
const booking_repository_1 = require("../../domain/booking/booking.repository");
let ImportXlsxUseCase = class ImportXlsxUseCase {
    constructor(propertyRepo, bedRepo, residentRepo, bookingRepo) {
        this.propertyRepo = propertyRepo;
        this.bedRepo = bedRepo;
        this.residentRepo = residentRepo;
        this.bookingRepo = bookingRepo;
    }
    async execute(buffer) {
        const rows = (0, xlsx_parser_1.parseXlsx)(buffer);
        let imported = 0;
        for (const row of rows) {
            const property = await this.propertyRepo.upsertByCode({
                code: row.code,
                bu: row.bu,
                area: row.area,
                fullAddress: row.fullAddress,
                keysCount: row.keysCount,
                securityKeysCount: row.securityKeysCount,
                fobCount: row.fobCount,
                electricityStatus: row.electricityStatus,
                gasStatus: row.gasStatus,
            });
            const bed = await this.bedRepo.upsertByPropertyAndNumber({
                propertyId: property.id,
                bedNumber: row.bedNumber,
                bedroomType: row.bedroomType,
                sex: row.sex,
                bedSize: row.bedSize,
                depositAmount: row.depositAmount,
                rentAmount: row.rentAmount,
            });
            await this.bookingRepo.deleteByBedId(bed.id);
            const currentName = row.residentName;
            if (currentName && currentName.toLowerCase() !== 'resident full name') {
                const resident = await this.residentRepo.save({
                    fullName: currentName,
                    email: row.residentEmail,
                    telephone: row.residentTelephone,
                    nationality: row.residentNationality,
                    personalId: row.residentPersonalId,
                    iban: row.residentIban,
                    emergencyContact: row.residentEmergencyContact,
                    source: row.residentSource,
                });
                const today = new Date();
                const contractEnd = row.contractEndDate;
                const checkOut = row.checkOutDate;
                const isCompleted = checkOut && checkOut < today;
                await this.bookingRepo.save({
                    bedId: bed.id,
                    residentId: resident.id,
                    checkInDate: row.checkInDate,
                    contractEndDate: contractEnd,
                    checkOutDate: checkOut,
                    depositAmount: row.depositAmount,
                    rentAmount: row.rentAmount,
                    isHeadResident: row.residentIsHead,
                    isTemporary: false,
                    status: isCompleted ? 'completed' : 'active',
                    comments: row.comments,
                });
            }
            const tempName = row.tempResidentName;
            if (tempName && tempName.toLowerCase() !== 'new resident' && tempName.toLowerCase() !== 'resident full name') {
                const tempResident = await this.residentRepo.save({
                    fullName: tempName,
                    email: row.tempResidentEmail,
                    telephone: row.tempResidentTelephone,
                    nationality: row.tempResidentNationality,
                    personalId: row.tempResidentPersonalId,
                    iban: row.tempResidentIban,
                    emergencyContact: row.tempResidentEmergencyContact,
                    source: row.tempResidentSource,
                });
                await this.bookingRepo.save({
                    bedId: bed.id,
                    residentId: tempResident.id,
                    checkInDate: row.tempCheckInDate,
                    contractEndDate: row.tempContractEndDate,
                    depositAmount: row.tempDepositAmount ?? 0,
                    rentAmount: row.tempRentAmount ?? 0,
                    isHeadResident: row.tempResidentIsHead,
                    isTemporary: true,
                    status: 'upcoming',
                    comments: null,
                });
            }
            imported++;
        }
        return { imported };
    }
};
exports.ImportXlsxUseCase = ImportXlsxUseCase;
exports.ImportXlsxUseCase = ImportXlsxUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(property_repository_1.PROPERTY_REPOSITORY)),
    __param(1, (0, common_1.Inject)(bed_repository_1.BED_REPOSITORY)),
    __param(2, (0, common_1.Inject)(resident_repository_1.RESIDENT_REPOSITORY)),
    __param(3, (0, common_1.Inject)(booking_repository_1.BOOKING_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ImportXlsxUseCase);
//# sourceMappingURL=import-xlsx.use-case.js.map
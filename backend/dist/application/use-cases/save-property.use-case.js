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
exports.SavePropertyUseCase = void 0;
const common_1 = require("@nestjs/common");
const property_repository_1 = require("../../domain/property/property.repository");
const landlord_repository_1 = require("../../domain/landlord/landlord.repository");
const ALLOWED_PROPERTY_TYPES = ['House', 'Apartment', 'Duplex', 'Studio Block', 'Other'];
let SavePropertyUseCase = class SavePropertyUseCase {
    constructor(repo, landlordRepo) {
        this.repo = repo;
        this.landlordRepo = landlordRepo;
    }
    async execute(dto) {
        if (dto.id) {
            const existing = await this.repo.findById(dto.id);
            if (!existing)
                throw new common_1.NotFoundException(`Property ${dto.id} not found`);
        }
        const normalized = this.normalize(dto);
        this.validateFields(normalized);
        await this.validateUniqueness(normalized);
        await this.validateLandlord(normalized);
        if (normalized.id)
            return this.repo.save(normalized);
        return this.repo.save({ ...normalized, active: true });
    }
    normalize(dto) {
        const result = { ...dto };
        if (result.eirCode != null) {
            result.eirCode = result.eirCode.trim().toUpperCase() || null;
        }
        if (result.internetContractEndDate === '')
            result.internetContractEndDate = null;
        return result;
    }
    validateFields(dto) {
        if (dto.eirCode && dto.eirCode.length > 10) {
            throw new common_1.BadRequestException('EirCode must be 10 characters or fewer');
        }
        if (dto.propertyType != null && !ALLOWED_PROPERTY_TYPES.includes(dto.propertyType)) {
            throw new common_1.BadRequestException(`Invalid property type "${dto.propertyType}". Allowed: ${ALLOWED_PROPERTY_TYPES.join(', ')}`);
        }
    }
    async validateLandlord(dto) {
        if (dto.landlordId) {
            const landlord = await this.landlordRepo.findById(dto.landlordId);
            if (!landlord)
                throw new common_1.NotFoundException(`Landlord ${dto.landlordId} not found`);
        }
    }
    async validateUniqueness(dto) {
        const byCode = await this.repo.findByCode(dto.code);
        if (byCode && byCode.id !== dto.id) {
            throw new common_1.BadRequestException(`There is already another property with code "${dto.code}". Try another Property Code or edit the existing Property Profile for that code.`);
        }
        if (dto.electricityMprn) {
            const conflict = await this.repo.findByMprn(dto.electricityMprn);
            if (conflict && conflict.id !== dto.id) {
                throw new common_1.BadRequestException(`MPRN ${dto.electricityMprn} is already in use by property ${conflict.code}`);
            }
        }
        if (dto.gasGprn) {
            const conflict = await this.repo.findByGprn(dto.gasGprn);
            if (conflict && conflict.id !== dto.id) {
                throw new common_1.BadRequestException(`GPRN ${dto.gasGprn} is already in use by property ${conflict.code}`);
            }
        }
    }
};
exports.SavePropertyUseCase = SavePropertyUseCase;
exports.SavePropertyUseCase = SavePropertyUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(property_repository_1.PROPERTY_REPOSITORY)),
    __param(1, (0, common_1.Inject)(landlord_repository_1.LANDLORD_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object])
], SavePropertyUseCase);
//# sourceMappingURL=save-property.use-case.js.map
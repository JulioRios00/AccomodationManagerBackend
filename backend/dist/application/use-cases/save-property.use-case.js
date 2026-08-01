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
let SavePropertyUseCase = class SavePropertyUseCase {
    constructor(repo) {
        this.repo = repo;
    }
    async execute(dto) {
        if (dto.id) {
            const existing = await this.repo.findById(dto.id);
            if (!existing)
                throw new common_1.NotFoundException(`Property ${dto.id} not found`);
        }
        await this.validateUniqueness(dto);
        if (dto.id)
            return this.repo.save(dto);
        return this.repo.save({ ...dto, active: true });
    }
    async validateUniqueness(dto) {
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
    __metadata("design:paramtypes", [Object])
], SavePropertyUseCase);
//# sourceMappingURL=save-property.use-case.js.map
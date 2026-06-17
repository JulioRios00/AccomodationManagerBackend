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
exports.PropertyTypeOrmRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const property_entity_1 = require("../../../../domain/property/property.entity");
const property_orm_entity_1 = require("../entities/property.orm-entity");
let PropertyTypeOrmRepository = class PropertyTypeOrmRepository {
    constructor(repo) {
        this.repo = repo;
    }
    async findAll() {
        console.log('[PropertyRepo] findAll — querying WHERE active = true');
        const entities = await this.repo.find({ where: { active: true }, relations: ['beds'] });
        console.log(`[PropertyRepo] findAll — raw DB rows (${entities.length}):`, entities.map(e => ({ id: e.id, code: e.code, active: e.active })));
        return entities.map(this.toDomain);
    }
    async findById(id) {
        const entity = await this.repo.findOne({ where: { id, active: true } });
        return entity ? this.toDomain(entity) : null;
    }
    async findByCode(code) {
        const entity = await this.repo.findOne({ where: { code, active: true } });
        return entity ? this.toDomain(entity) : null;
    }
    async save(property) {
        console.log('[PropertyRepo] save — input:', { ...property, active: property.active });
        const entity = this.repo.create(property);
        const saved = await this.repo.save(entity);
        console.log('[PropertyRepo] save — saved row active =', saved.active);
        return this.toDomain(saved);
    }
    async delete(id) {
        await this.repo.update(id, { active: false });
    }
    async upsertByCode(property) {
        let entity = await this.repo.findOne({ where: { code: property.code } });
        if (entity) {
            Object.assign(entity, property);
        }
        else {
            entity = this.repo.create(property);
        }
        const saved = await this.repo.save(entity);
        return this.toDomain(saved);
    }
    toDomain(entity) {
        const p = new property_entity_1.Property();
        p.id = entity.id;
        p.code = entity.code;
        p.bu = entity.bu;
        p.area = entity.area;
        p.fullAddress = entity.fullAddress;
        p.officeKeys = entity.officeKeys;
        p.keysCount = entity.keysCount;
        p.securityKeysCount = entity.securityKeysCount;
        p.fobCount = entity.fobCount;
        p.electricityStatus = entity.electricityStatus;
        p.gasStatus = entity.gasStatus;
        p.active = entity.active;
        p.createdAt = entity.createdAt;
        p.updatedAt = entity.updatedAt;
        return p;
    }
};
exports.PropertyTypeOrmRepository = PropertyTypeOrmRepository;
exports.PropertyTypeOrmRepository = PropertyTypeOrmRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(property_orm_entity_1.PropertyOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PropertyTypeOrmRepository);
//# sourceMappingURL=property.typeorm-repository.js.map
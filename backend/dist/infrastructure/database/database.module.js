"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const property_orm_entity_1 = require("./typeorm/entities/property.orm-entity");
const bed_orm_entity_1 = require("./typeorm/entities/bed.orm-entity");
const resident_orm_entity_1 = require("./typeorm/entities/resident.orm-entity");
const booking_orm_entity_1 = require("./typeorm/entities/booking.orm-entity");
const property_typeorm_repository_1 = require("./typeorm/repositories/property.typeorm-repository");
const bed_typeorm_repository_1 = require("./typeorm/repositories/bed.typeorm-repository");
const resident_typeorm_repository_1 = require("./typeorm/repositories/resident.typeorm-repository");
const booking_typeorm_repository_1 = require("./typeorm/repositories/booking.typeorm-repository");
const property_repository_1 = require("../../domain/property/property.repository");
const bed_repository_1 = require("../../domain/bed/bed.repository");
const resident_repository_1 = require("../../domain/resident/resident.repository");
const booking_repository_1 = require("../../domain/booking/booking.repository");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const password = config.get('DB_PASSWORD', '');
                    return {
                        type: 'postgres',
                        host: config.get('DB_HOST', 'localhost'),
                        port: config.get('DB_PORT', 5432),
                        username: config.get('DB_USER', 'postgres'),
                        password: password || undefined,
                        database: config.get('DB_NAME', 'accommodation'),
                        entities: [property_orm_entity_1.PropertyOrmEntity, bed_orm_entity_1.BedOrmEntity, resident_orm_entity_1.ResidentOrmEntity, booking_orm_entity_1.BookingOrmEntity],
                        synchronize: true,
                    };
                },
            }),
            typeorm_1.TypeOrmModule.forFeature([
                property_orm_entity_1.PropertyOrmEntity,
                bed_orm_entity_1.BedOrmEntity,
                resident_orm_entity_1.ResidentOrmEntity,
                booking_orm_entity_1.BookingOrmEntity,
            ]),
        ],
        providers: [
            { provide: property_repository_1.PROPERTY_REPOSITORY, useClass: property_typeorm_repository_1.PropertyTypeOrmRepository },
            { provide: bed_repository_1.BED_REPOSITORY, useClass: bed_typeorm_repository_1.BedTypeOrmRepository },
            { provide: resident_repository_1.RESIDENT_REPOSITORY, useClass: resident_typeorm_repository_1.ResidentTypeOrmRepository },
            { provide: booking_repository_1.BOOKING_REPOSITORY, useClass: booking_typeorm_repository_1.BookingTypeOrmRepository },
        ],
        exports: [property_repository_1.PROPERTY_REPOSITORY, bed_repository_1.BED_REPOSITORY, resident_repository_1.RESIDENT_REPOSITORY, booking_repository_1.BOOKING_REPOSITORY],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map
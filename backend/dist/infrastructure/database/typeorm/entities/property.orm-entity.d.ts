import { BedOrmEntity } from './bed.orm-entity';
export declare class PropertyOrmEntity {
    id: string;
    code: string;
    bu: string;
    area: string;
    fullAddress: string;
    officeKeys: boolean;
    keysCount: number;
    securityKeysCount: number;
    fobCount: number;
    electricityStatus: string;
    gasStatus: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    beds: BedOrmEntity[];
}

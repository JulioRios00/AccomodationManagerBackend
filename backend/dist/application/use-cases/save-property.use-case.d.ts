import { Property } from '../../domain/property/property.entity';
import { IPropertyRepository } from '../../domain/property/property.repository';
export interface SavePropertyDto {
    id?: string;
    code: string;
    bu: string;
    area?: string | null;
    fullAddress?: string | null;
    officeKeys?: boolean;
    keysCount?: number;
    securityKeysCount?: number;
    fobCount?: number;
    electricityStatus?: string | null;
    gasStatus?: string | null;
}
export declare class SavePropertyUseCase {
    private readonly repo;
    constructor(repo: IPropertyRepository);
    execute(dto: SavePropertyDto): Promise<Property>;
}

import { GetPropertiesUseCase } from '../../application/use-cases/get-properties.use-case';
import { SavePropertyUseCase, SavePropertyDto } from '../../application/use-cases/save-property.use-case';
import { DeletePropertyUseCase } from '../../application/use-cases/delete-property.use-case';
export declare class PropertiesController {
    private readonly getProperties;
    private readonly saveProperty;
    private readonly deleteProperty;
    constructor(getProperties: GetPropertiesUseCase, saveProperty: SavePropertyUseCase, deleteProperty: DeletePropertyUseCase);
    findAll(): Promise<import("../../domain/property/property.entity").Property[]>;
    create(dto: SavePropertyDto): Promise<import("../../domain/property/property.entity").Property>;
    update(id: string, dto: SavePropertyDto): Promise<import("../../domain/property/property.entity").Property>;
    remove(id: string): Promise<void>;
}

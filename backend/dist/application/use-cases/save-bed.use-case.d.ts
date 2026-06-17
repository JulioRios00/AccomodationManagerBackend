import { Bed } from '../../domain/bed/bed.entity';
import { IBedRepository } from '../../domain/bed/bed.repository';
export interface SaveBedDto {
    id?: string;
    propertyId: string;
    bedNumber: number;
    bedroomType: string;
    sex: string;
    bedSize: string;
    depositAmount?: number;
    rentAmount?: number;
}
export declare class SaveBedUseCase {
    private readonly repo;
    constructor(repo: IBedRepository);
    execute(dto: SaveBedDto): Promise<Bed>;
}

import { Repository } from 'typeorm';
import { Bed } from '../../../../domain/bed/bed.entity';
import { IBedRepository } from '../../../../domain/bed/bed.repository';
import { BedOrmEntity } from '../entities/bed.orm-entity';
export declare class BedTypeOrmRepository implements IBedRepository {
    private readonly repo;
    constructor(repo: Repository<BedOrmEntity>);
    findAll(propertyId?: string): Promise<Bed[]>;
    findById(id: string): Promise<Bed | null>;
    findByPropertyAndNumber(propertyId: string, bedNumber: number): Promise<Bed | null>;
    save(bed: Partial<Bed>): Promise<Bed>;
    delete(id: string): Promise<void>;
    deleteByPropertyId(propertyId: string): Promise<void>;
    upsertByPropertyAndNumber(bed: Partial<Bed>): Promise<Bed>;
    private toDomain;
}

import { Repository } from 'typeorm';
import { Resident } from '../../../../domain/resident/resident.entity';
import { IResidentRepository } from '../../../../domain/resident/resident.repository';
import { ResidentOrmEntity } from '../entities/resident.orm-entity';
export declare class ResidentTypeOrmRepository implements IResidentRepository {
    private readonly repo;
    constructor(repo: Repository<ResidentOrmEntity>);
    findAll(): Promise<Resident[]>;
    findById(id: string): Promise<Resident | null>;
    save(resident: Partial<Resident>): Promise<Resident>;
    delete(id: string): Promise<void>;
    private toDomain;
}

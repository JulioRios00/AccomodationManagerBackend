import { Resident } from '../../domain/resident/resident.entity';
import { IResidentRepository } from '../../domain/resident/resident.repository';
export interface SaveResidentDto {
    id?: string;
    fullName: string;
    email?: string | null;
    telephone?: string | null;
    nationality?: string | null;
    personalId?: string | null;
    iban?: string | null;
    emergencyContact?: string | null;
    source?: string | null;
}
export declare class SaveResidentUseCase {
    private readonly repo;
    constructor(repo: IResidentRepository);
    execute(dto: SaveResidentDto): Promise<Resident>;
}

import { Resident } from '../../domain/resident/resident.entity';
import { IResidentRepository } from '../../domain/resident/resident.repository';
export interface SaveResidentDto {
    id?: string;
    clerkUserId?: string | null;
    fullName: string;
    email?: string | null;
    telephone?: string | null;
    gender?: string | null;
    nationality?: string | null;
    personalId?: string | null;
    iban?: string | null;
    emergencyContact?: string | null;
    source?: string | null;
    paymentDueDay?: number | null;
    comments?: string | null;
    delinquent?: boolean;
    hasObservation?: boolean;
    observation?: string | null;
}
export declare class SaveResidentUseCase {
    private readonly repo;
    constructor(repo: IResidentRepository);
    execute(dto: SaveResidentDto): Promise<Resident>;
}

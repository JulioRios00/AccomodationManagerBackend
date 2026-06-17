import { IResidentRepository } from '../../domain/resident/resident.repository';
import { Resident } from '../../domain/resident/resident.entity';
export declare class GetResidentsUseCase {
    private readonly residentRepo;
    constructor(residentRepo: IResidentRepository);
    execute(): Promise<Resident[]>;
}

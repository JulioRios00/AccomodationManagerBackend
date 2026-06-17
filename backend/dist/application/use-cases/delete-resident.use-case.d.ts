import { IResidentRepository } from '../../domain/resident/resident.repository';
export declare class DeleteResidentUseCase {
    private readonly repo;
    constructor(repo: IResidentRepository);
    execute(id: string): Promise<void>;
}

import { IBookingRepository } from '../../domain/booking/booking.repository';
import { IBedRepository } from '../../domain/bed/bed.repository';
export declare class DeleteBookingUseCase {
    private readonly repo;
    private readonly bedRepo;
    constructor(repo: IBookingRepository, bedRepo: IBedRepository);
    execute(id: string): Promise<void>;
}

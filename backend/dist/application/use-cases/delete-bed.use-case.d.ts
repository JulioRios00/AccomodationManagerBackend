import { IBedRepository } from '../../domain/bed/bed.repository';
import { IBookingRepository } from '../../domain/booking/booking.repository';
export declare class DeleteBedUseCase {
    private readonly bedRepo;
    private readonly bookingRepo;
    constructor(bedRepo: IBedRepository, bookingRepo: IBookingRepository);
    execute(id: string): Promise<void>;
}

import { IBedRepository } from '../../domain/bed/bed.repository';
import { IBookingRepository } from '../../domain/booking/booking.repository';
import { Bed } from '../../domain/bed/bed.entity';
export interface BedWithBooking extends Bed {
    activeBooking?: any;
}
export declare class GetBedsUseCase {
    private readonly bedRepo;
    private readonly bookingRepo;
    constructor(bedRepo: IBedRepository, bookingRepo: IBookingRepository);
    execute(propertyId?: string): Promise<BedWithBooking[]>;
}

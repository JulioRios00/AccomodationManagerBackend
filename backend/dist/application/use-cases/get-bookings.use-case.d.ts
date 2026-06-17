import { IBookingRepository } from '../../domain/booking/booking.repository';
import { Booking, BookingStatus } from '../../domain/booking/booking.entity';
export declare class GetBookingsUseCase {
    private readonly bookingRepo;
    constructor(bookingRepo: IBookingRepository);
    execute(status?: BookingStatus): Promise<Booking[]>;
}

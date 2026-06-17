import { GetBookingsUseCase } from '../../application/use-cases/get-bookings.use-case';
import { SaveBookingUseCase, SaveBookingDto } from '../../application/use-cases/save-booking.use-case';
import { DeleteBookingUseCase } from '../../application/use-cases/delete-booking.use-case';
import { BookingStatus } from '../../domain/booking/booking.entity';
export declare class BookingsController {
    private readonly getBookings;
    private readonly saveBooking;
    private readonly deleteBooking;
    constructor(getBookings: GetBookingsUseCase, saveBooking: SaveBookingUseCase, deleteBooking: DeleteBookingUseCase);
    findAll(status?: BookingStatus): Promise<import("../../domain/booking/booking.entity").Booking[]>;
    create(dto: SaveBookingDto): Promise<import("../../domain/booking/booking.entity").Booking>;
    update(id: string, dto: SaveBookingDto): Promise<import("../../domain/booking/booking.entity").Booking>;
    remove(id: string): Promise<void>;
}

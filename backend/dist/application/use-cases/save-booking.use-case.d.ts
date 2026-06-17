import { Booking, BookingStatus } from '../../domain/booking/booking.entity';
import { IBookingRepository } from '../../domain/booking/booking.repository';
export interface SaveBookingDto {
    id?: string;
    bedId: string;
    residentId: string;
    checkInDate?: string | null;
    contractEndDate?: string | null;
    checkOutDate?: string | null;
    depositAmount?: number;
    rentAmount?: number;
    isHeadResident?: boolean;
    isTemporary?: boolean;
    status: BookingStatus;
    comments?: string | null;
}
export declare class SaveBookingUseCase {
    private readonly repo;
    constructor(repo: IBookingRepository);
    execute(dto: SaveBookingDto): Promise<Booking>;
}

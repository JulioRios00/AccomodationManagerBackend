import { Booking, BookingStatus } from '../../domain/booking/booking.entity';
import { IBookingRepository } from '../../domain/booking/booking.repository';
import { IBedRepository } from '../../domain/bed/bed.repository';
import { IResidentRepository } from '../../domain/resident/resident.repository';
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
    private readonly bedRepo;
    private readonly residentRepo;
    constructor(repo: IBookingRepository, bedRepo: IBedRepository, residentRepo: IResidentRepository);
    execute(dto: SaveBookingDto): Promise<Booking>;
}

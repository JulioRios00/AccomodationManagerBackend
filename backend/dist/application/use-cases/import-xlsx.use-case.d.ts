import { IPropertyRepository } from '../../domain/property/property.repository';
import { IBedRepository } from '../../domain/bed/bed.repository';
import { IResidentRepository } from '../../domain/resident/resident.repository';
import { IBookingRepository } from '../../domain/booking/booking.repository';
export declare class ImportXlsxUseCase {
    private readonly propertyRepo;
    private readonly bedRepo;
    private readonly residentRepo;
    private readonly bookingRepo;
    constructor(propertyRepo: IPropertyRepository, bedRepo: IBedRepository, residentRepo: IResidentRepository, bookingRepo: IBookingRepository);
    execute(buffer: Buffer): Promise<{
        imported: number;
    }>;
}

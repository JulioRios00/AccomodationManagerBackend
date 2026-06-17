import { IPropertyRepository } from '../../domain/property/property.repository';
import { IBedRepository } from '../../domain/bed/bed.repository';
import { IBookingRepository } from '../../domain/booking/booking.repository';
export declare class DeletePropertyUseCase {
    private readonly propertyRepo;
    private readonly bedRepo;
    private readonly bookingRepo;
    constructor(propertyRepo: IPropertyRepository, bedRepo: IBedRepository, bookingRepo: IBookingRepository);
    execute(id: string): Promise<void>;
}

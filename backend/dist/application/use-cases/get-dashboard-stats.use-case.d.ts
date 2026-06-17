import { IPropertyRepository } from '../../domain/property/property.repository';
import { IBedRepository } from '../../domain/bed/bed.repository';
import { IBookingRepository } from '../../domain/booking/booking.repository';
import { DashboardStatsDto } from '../dto/dashboard-stats.dto';
export declare class GetDashboardStatsUseCase {
    private readonly propertyRepo;
    private readonly bedRepo;
    private readonly bookingRepo;
    constructor(propertyRepo: IPropertyRepository, bedRepo: IBedRepository, bookingRepo: IBookingRepository);
    execute(): Promise<DashboardStatsDto>;
}

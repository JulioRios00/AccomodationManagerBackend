import { BedOrmEntity } from './bed.orm-entity';
import { ResidentOrmEntity } from './resident.orm-entity';
export type BookingStatus = 'active' | 'upcoming' | 'completed';
export declare class BookingOrmEntity {
    id: string;
    bedId: string;
    residentId: string;
    checkInDate: Date;
    contractEndDate: Date;
    checkOutDate: Date;
    depositAmount: number;
    rentAmount: number;
    isHeadResident: boolean;
    isTemporary: boolean;
    status: BookingStatus;
    comments: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    bed: BedOrmEntity;
    resident: ResidentOrmEntity;
}

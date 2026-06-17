import { PropertyOrmEntity } from './property.orm-entity';
import { BookingOrmEntity } from './booking.orm-entity';
export declare class BedOrmEntity {
    id: string;
    propertyId: string;
    bedNumber: number;
    bedroomType: string;
    sex: string;
    bedSize: string;
    depositAmount: number;
    rentAmount: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    property: PropertyOrmEntity;
    bookings: BookingOrmEntity[];
}

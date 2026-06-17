import { BookingOrmEntity } from './booking.orm-entity';
export declare class ResidentOrmEntity {
    id: string;
    fullName: string;
    email: string;
    telephone: string;
    nationality: string;
    personalId: string;
    iban: string;
    emergencyContact: string;
    source: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    bookings: BookingOrmEntity[];
}

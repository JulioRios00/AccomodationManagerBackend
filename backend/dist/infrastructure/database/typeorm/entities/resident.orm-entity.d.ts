import { BookingOrmEntity } from './booking.orm-entity';
export declare class ResidentOrmEntity {
    id: string;
    clerkUserId: string;
    fullName: string;
    email: string;
    telephone: string;
    gender: string;
    nationality: string;
    personalId: string;
    iban: string;
    emergencyContact: string;
    source: string;
    paymentDueDay: number;
    comments: string;
    delinquent: boolean;
    hasObservation: boolean;
    observation: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    bookings: BookingOrmEntity[];
}

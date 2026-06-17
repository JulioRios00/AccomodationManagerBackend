import { IBookingRepository } from '../../domain/booking/booking.repository';
export declare class DeleteBookingUseCase {
    private readonly repo;
    constructor(repo: IBookingRepository);
    execute(id: string): Promise<void>;
}

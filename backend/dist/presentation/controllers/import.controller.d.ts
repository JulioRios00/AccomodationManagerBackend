import { ImportXlsxUseCase } from '../../application/use-cases/import-xlsx.use-case';
import { ImportBillsUseCase } from '../../application/use-cases/import-bills.use-case';
import { ImportMaintenanceUseCase } from '../../application/use-cases/import-maintenance.use-case';
import { ImportDepositsUseCase } from '../../application/use-cases/import-deposits.use-case';
import { ImportLandlordPaymentsUseCase } from '../../application/use-cases/import-landlord-payments.use-case';
import { ImportResidentPaymentsUseCase } from '../../application/use-cases/import-resident-payments.use-case';
export declare class ImportController {
    private readonly importXlsxUseCase;
    private readonly importBillsUseCase;
    private readonly importMaintenanceUseCase;
    private readonly importDepositsUseCase;
    private readonly importLandlordPaymentsUseCase;
    private readonly importResidentPaymentsUseCase;
    constructor(importXlsxUseCase: ImportXlsxUseCase, importBillsUseCase: ImportBillsUseCase, importMaintenanceUseCase: ImportMaintenanceUseCase, importDepositsUseCase: ImportDepositsUseCase, importLandlordPaymentsUseCase: ImportLandlordPaymentsUseCase, importResidentPaymentsUseCase: ImportResidentPaymentsUseCase);
    importAccommodation(file: Express.Multer.File): Promise<{
        imported: number;
        message: string;
    }>;
    importBills(file: Express.Multer.File): Promise<{
        updated: number;
        skipped: number;
        message: string;
    }>;
    importMaintenance(file: Express.Multer.File): Promise<{
        imported: number;
        skipped: number;
        message: string;
    }>;
    importDeposits(file: Express.Multer.File): Promise<{
        imported: number;
        skipped: number;
        message: string;
    }>;
    importLandlordPayments(file: Express.Multer.File): Promise<{
        imported: number;
        skipped: number;
        message: string;
    }>;
    importResidentPayments(file: Express.Multer.File): Promise<{
        imported: number;
        skipped: number;
        message: string;
    }>;
}

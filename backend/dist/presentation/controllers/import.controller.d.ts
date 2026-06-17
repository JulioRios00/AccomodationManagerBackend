import { ImportXlsxUseCase } from '../../application/use-cases/import-xlsx.use-case';
export declare class ImportController {
    private readonly importXlsxUseCase;
    constructor(importXlsxUseCase: ImportXlsxUseCase);
    importFile(file: Express.Multer.File): Promise<{
        imported: number;
        message: string;
    }>;
}

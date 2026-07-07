"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const import_xlsx_use_case_1 = require("../../application/use-cases/import-xlsx.use-case");
const roles_decorator_1 = require("../decorators/roles.decorator");
let ImportController = class ImportController {
    constructor(importXlsxUseCase) {
        this.importXlsxUseCase = importXlsxUseCase;
    }
    async importFile(file) {
        if (!file)
            throw new common_1.BadRequestException('No file provided');
        const result = await this.importXlsxUseCase.execute(file.buffer);
        return { message: `Successfully imported ${result.imported} beds`, ...result };
    }
};
exports.ImportController = ImportController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('sysadmin', 'manager'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ImportController.prototype, "importFile", null);
exports.ImportController = ImportController = __decorate([
    (0, common_1.Controller)('import'),
    __metadata("design:paramtypes", [import_xlsx_use_case_1.ImportXlsxUseCase])
], ImportController);
//# sourceMappingURL=import.controller.js.map
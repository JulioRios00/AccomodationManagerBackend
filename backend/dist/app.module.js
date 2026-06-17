"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_module_1 = require("./infrastructure/database/database.module");
const import_controller_1 = require("./presentation/controllers/import.controller");
const dashboard_controller_1 = require("./presentation/controllers/dashboard.controller");
const properties_controller_1 = require("./presentation/controllers/properties.controller");
const beds_controller_1 = require("./presentation/controllers/beds.controller");
const residents_controller_1 = require("./presentation/controllers/residents.controller");
const bookings_controller_1 = require("./presentation/controllers/bookings.controller");
const import_xlsx_use_case_1 = require("./application/use-cases/import-xlsx.use-case");
const get_dashboard_stats_use_case_1 = require("./application/use-cases/get-dashboard-stats.use-case");
const get_properties_use_case_1 = require("./application/use-cases/get-properties.use-case");
const get_beds_use_case_1 = require("./application/use-cases/get-beds.use-case");
const get_residents_use_case_1 = require("./application/use-cases/get-residents.use-case");
const get_bookings_use_case_1 = require("./application/use-cases/get-bookings.use-case");
const save_property_use_case_1 = require("./application/use-cases/save-property.use-case");
const delete_property_use_case_1 = require("./application/use-cases/delete-property.use-case");
const save_bed_use_case_1 = require("./application/use-cases/save-bed.use-case");
const delete_bed_use_case_1 = require("./application/use-cases/delete-bed.use-case");
const save_resident_use_case_1 = require("./application/use-cases/save-resident.use-case");
const delete_resident_use_case_1 = require("./application/use-cases/delete-resident.use-case");
const save_booking_use_case_1 = require("./application/use-cases/save-booking.use-case");
const delete_booking_use_case_1 = require("./application/use-cases/delete-booking.use-case");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            database_module_1.DatabaseModule,
        ],
        controllers: [
            import_controller_1.ImportController,
            dashboard_controller_1.DashboardController,
            properties_controller_1.PropertiesController,
            beds_controller_1.BedsController,
            residents_controller_1.ResidentsController,
            bookings_controller_1.BookingsController,
        ],
        providers: [
            import_xlsx_use_case_1.ImportXlsxUseCase,
            get_dashboard_stats_use_case_1.GetDashboardStatsUseCase,
            get_properties_use_case_1.GetPropertiesUseCase,
            get_beds_use_case_1.GetBedsUseCase,
            get_residents_use_case_1.GetResidentsUseCase,
            get_bookings_use_case_1.GetBookingsUseCase,
            save_property_use_case_1.SavePropertyUseCase,
            delete_property_use_case_1.DeletePropertyUseCase,
            save_bed_use_case_1.SaveBedUseCase,
            delete_bed_use_case_1.DeleteBedUseCase,
            save_resident_use_case_1.SaveResidentUseCase,
            delete_resident_use_case_1.DeleteResidentUseCase,
            save_booking_use_case_1.SaveBookingUseCase,
            delete_booking_use_case_1.DeleteBookingUseCase,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
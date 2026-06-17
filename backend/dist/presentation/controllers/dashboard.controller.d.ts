import { GetDashboardStatsUseCase } from '../../application/use-cases/get-dashboard-stats.use-case';
export declare class DashboardController {
    private readonly getDashboardStats;
    constructor(getDashboardStats: GetDashboardStatsUseCase);
    getStats(): Promise<import("../../application/dto/dashboard-stats.dto").DashboardStatsDto>;
}

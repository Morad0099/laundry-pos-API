import { DashboardService } from '../services/dashboard.service';
import { ResponseHandler } from '../utils/response.handler';
import type { ApiResponse } from '../types/response.types';

export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  async getDashboardStats(dateRange?: string): Promise<ApiResponse<any>> {
    try {
      const stats = await this.dashboardService.getDashboardStats(dateRange);
      return ResponseHandler.success(
        stats,
        'Dashboard stats retrieved successfully'
      );
    } catch (error) {
      return ResponseHandler.error(
        'Error retrieving dashboard stats',
        500,
        (error as Error).message
      );
    }
  }
}
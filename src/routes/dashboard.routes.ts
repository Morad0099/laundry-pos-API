import { Elysia, t } from 'elysia';
import { DashboardController } from '../controllers/dashboard.controller';
import { DashboardService } from '../services/dashboard.service';
import { createProtectedRoute } from '../middleware/setup.middleware';

const dashboardController = new DashboardController(new DashboardService());
const router = new Elysia();

export const dashboardRoutes = createProtectedRoute(router)
  .get('/dashboard/stats', 
    async ({ query }) => {
      return await dashboardController.getDashboardStats(query?.dateRange as string);
    },
    {
      query: t.Object({
        dateRange: t.Optional(t.String())
      })
    }
  );
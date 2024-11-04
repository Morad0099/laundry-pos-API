import { CustomerModel } from '../models/customer.model';
import { OrderModel } from '../models/order.model';
import type { 
  DashboardStats, 
  RevenueChartData, 
  RecentOrder,
  ActivityItem,
//   Order,
  Customer 
} from '../types/dashboard.types';

export class DashboardService {
  async getDashboardStats(dateRange?: string): Promise<DashboardStats> {
    try {
      // Get total customers
      const totalCustomers = await CustomerModel.countDocuments();

      // Get order stats
      const allOrders = await OrderModel.find()
        .populate<{ customer: Customer }>('customer')
        .sort({ createdAt: -1 });

      const pendingOrders = allOrders.filter(order => order.status === 'pending').length;
      const completedOrders = allOrders.filter(order => order.status === 'completed').length;
      const processingOrders = allOrders.filter(order => order.status === 'processing').length;

      // Calculate total revenue
      const totalRevenue = allOrders.reduce((sum, order) => sum + order.amount, 0);

      // Get revenue chart data
      const today = new Date();
      const revenueData = await this.getRevenueChartData(today, dateRange);

      // Get recent orders
      const recentOrders: RecentOrder[] = allOrders.slice(0, 5).map(order => ({
        orderNumber: order.orderNumber,
        customer: {
          name: order.customer.name,
          phone: order.customer.phone
        },
        amount: order.amount,
        status: order.status,
        createdAt: order.createdAt.toISOString()
      }));

      // Get recent activity
      const recentActivity = await this.getRecentActivity();

      return {
        totalOrders: allOrders.length,
        totalRevenue,
        totalCustomers,
        pendingOrders,
        revenueChart: revenueData,
        orderStats: {
          completed: completedOrders,
          pending: pendingOrders,
          processing: processingOrders,
        },
        recentOrders,
        recentActivity
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }

  private async getRevenueChartData(today: Date, dateRange = 'week'): Promise<RevenueChartData[]> {
    let startDate: Date;
    const endDate = today;

    switch (dateRange) {
      case 'today':
        startDate = new Date(today.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(today.setDate(today.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(today.setMonth(today.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(today.setFullYear(today.getFullYear() - 1));
        break;
      default:
        startDate = new Date(today.setDate(today.getDate() - 7));
    }

    const orders = await OrderModel.find({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    // Group orders by date and sum amounts
    const revenueByDate = orders.reduce((acc, order) => {
      const date = new Date(order.createdAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + order.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(revenueByDate).map(([date, value]) => ({
      date,
      value
    }));
  }

  private async getRecentActivity(): Promise<ActivityItem[]> {
    const recentOrders = await OrderModel.find()
      .populate<{ customer: Customer }>('customer')
      .sort({ createdAt: -1 })
      .limit(5);

    return recentOrders.map(order => ({
      type: 'order',
      message: `New order #${order.orderNumber} from ${order.customer.name}`,
      time: order.createdAt.toISOString()
    }));
  }
}
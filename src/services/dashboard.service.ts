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
      const totalCustomers = await CustomerModel.countDocuments();

      const allOrders = await OrderModel.find()
        .populate<{ customer: Customer }>('customer')
        .sort({ createdAt: -1 });

      const orderStats = {
        'IN-PROCESS': allOrders.filter(order => order.status === 'IN-PROCESS').length,
        'PICKED-UP': allOrders.filter(order => order.status === 'PICKED-UP').length,
        'DELIVERED': allOrders.filter(order => order.status === 'DELIVERED').length,
        'CANCELLED': allOrders.filter(order => order.status === 'CANCELLED').length
      };

      // Calculate total revenue from order items
      const totalRevenue = allOrders.reduce((sum, order) => 
        sum + (order.totalAmount || 0), 0);

      // Get revenue chart data
      const today = new Date();
      const revenueData = await this.getRevenueChartData(today, dateRange);

      // Get recent orders with new structure
      const recentOrders: RecentOrder[] = allOrders.slice(0, 5).map(order => ({
        orderNumber: order.orderNumber,
        customer: {
          name: (order.customer as Customer).name,
          phone: (order.customer as Customer).phone
        },
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt?.toISOString() ?? new Date().toISOString(),
        orderItems: order.orderItems.map(item => ({
          _id: item._id,
          item: item.item,
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          amount: item.amount
        }))
      }));

      return {
        totalOrders: allOrders.length,
        totalRevenue,
        totalCustomers,
        pendingOrders: orderStats['IN-PROCESS'],
        revenueChart: revenueData,
        orderStats,
        recentOrders,
        recentActivity: await this.getRecentActivity()
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

    const revenueByDate = orders.reduce((acc, order) => {
      const date = order.createdAt?.toISOString().split('T')[0] ?? 
                  new Date().toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + (order.totalAmount || 0);
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
      message: `New order #${order.orderNumber} from ${(order.customer as Customer).name}`,
      time: order.createdAt?.toISOString() ?? new Date().toISOString()
    }));
  }
}
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Customer {
  _id: string;
  name: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface RevenueChartData {
  date: string;
  value: number;
}

export interface OrderStats {
  completed: number;
  pending: number;
  processing: number;
//   cancelled: number;
}

export interface RecentOrder {
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
  };
  amount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface ActivityItem {
  type: 'order' | 'payment' | 'user' | 'alert';
  message: string;
  time: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
  revenueChart: RevenueChartData[];
  orderStats: OrderStats;
  recentOrders: RecentOrder[];
  recentActivity: ActivityItem[];
}
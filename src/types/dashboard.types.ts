import { Types } from "mongoose";

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

export interface OrderInterface {
  _id: Types.ObjectId;
  orderNumber: string;
  customer: Types.ObjectId | Customer;
  orderDate: Date;
  orderItems: OrderItem[];
  totalAmount: number;
  receivedBy: string;
  invoiceNumber: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityItem {
  type: 'order' | 'payment' | 'user' | 'alert';
  message: string;
  time: string;
}

export type OrderStatus = 'DELIVERED' | 'PICKED-UP' | 'IN-PROCESS' | 'CANCELLED';

export interface OrderItem {
  _id: Types.ObjectId; 
  item: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

export interface OrderStats {
  'IN-PROCESS': number;
  'PICKED-UP': number;
  'DELIVERED': number;
  'CANCELLED': number;
}

export interface RecentOrder {
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
  };
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  orderItems: OrderItem[];
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
import { Types } from 'mongoose';

interface OrderItem {
  item: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

// export interface CreateOrderDTO {
//   customerId: string;
//   orderDate: Date;
//   orderItems: OrderItem[];
//   totalAmount: number;
//   receivedBy: string;
// }

export type OrderStatus = 'DELIVERED' | 'PICKED-UP' | 'IN-PROCESS' | 'CANCELLED';

export interface OrderInterface {
  _id: Types.ObjectId;
  orderNumber: string;
  customer: Types.ObjectId | {
    _id: string;
    name: string;
    phone: string;
    address: string;
  };
  orderDate: Date;
  orderItems: {
    item: string;
    description: string;
    quantity: number;
    price: number;
    amount: number;
  }[];
  totalAmount: number;
  amountPaid: number;  // Added field
  outstandingBalance: number;
  paymentMethod: 'cash' | 'bank' | 'mobile_money';
  receivedBy: string;
  invoiceNumber: string;
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateOrderDTO {
  customerId: string;
  orderDate: Date;
  orderItems: {
    item: string;
    description: string;
    quantity: number;
    price: number;
    amount: number;
  }[];
  totalAmount: number;
  amountPaid: number;  // Added field
  outstandingBalance: number;
  paymentMethod: 'cash' | 'bank' | 'mobile_money';
  receivedBy: string;
}

export interface OrderUpdateDTO {
  orderDate?: string;
  orderItems?: {
    item: string;
    description: string;
    quantity: number;
    price: number;
    amount: number;
  }[];
  totalAmount?: number;
  receivedBy?: string;
  amountPaid?: number;
  outstandingBalance?: number;
  paymentMethod?: 'cash' | 'bank' | 'mobile_money';
}
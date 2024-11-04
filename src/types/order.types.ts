import { Types } from 'mongoose';

export interface CreateOrderDTO {
  customerId: string;
  orderDate: Date;
  description: string;
  quantity: number;
  price: number;
  amount: number;
  receivedBy: string;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

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
  description: string;
  quantity: number;
  price: number;
  amount: number;
  receivedBy: string;
  invoiceNumber: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
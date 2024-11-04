// types/order-payment.types.ts
import { OrderDocument } from "../models/order.model";
import { PaymentDocument } from "../models/payment.model";

export interface CreateOrderPaymentDTO {
  customerId: string;
  orderDate: Date;
  description: string;
  quantity: number;
  price: number;
  amount: number;
  receivedBy: string;
  cash: number;
  paymentMethod?: 'cash' | 'bank' | 'mobile_money';
  reference?: string;
}

export interface OrderPaymentResponse {
  order: OrderDocument;
  payment: PaymentDocument;
}

export interface CreateOrderDTO {
  customerId: string;
  orderDate: Date;
  description: string;
  quantity: number;
  price: number;
  amount: number;
  receivedBy: string;
}
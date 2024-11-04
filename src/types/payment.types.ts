// types/payment.types.ts
import { Types } from 'mongoose';

export interface PaymentInterface {
  order: Types.ObjectId;
  customer: Types.ObjectId;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'cash' | 'bank' | 'mobile_money';
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePaymentDTO {
  order: string;
  customer: string;
  amount: number;
  paymentMethod: 'cash' | 'bank' | 'mobile_money';
  reference?: string;
}
import { OrderService } from './order.service';
import { PaymentService } from './payment.service';
import type { CreateOrderPaymentDTO } from '../types/order-payment.types';
import type { OrderDocument } from '../models/order.model';
import type { PaymentDocument } from '../models/payment.model';
import mongoose from 'mongoose';

export class OrderPaymentService {
  constructor(
    protected readonly orderService: OrderService,
    protected readonly paymentService: PaymentService
  ) {}

  async createOrderWithPayment(
    data: CreateOrderPaymentDTO
  ): Promise<{ order: OrderDocument; payment: PaymentDocument }> {
    try {
      // Calculate the outstanding balance correctly
      const outstandingBalance = data.amountPaid - data.totalAmount;

      // Create order with payment details
      const order = await this.orderService.create({
        customerId: data.customerId,
        orderDate: data.orderDate,
        orderItems: data.orderItems,
        totalAmount: data.totalAmount,
        amountPaid: data.amountPaid,
        outstandingBalance: outstandingBalance,
        paymentMethod: data.paymentMethod || 'cash',
        receivedBy: data.receivedBy
      });

      // Ensure we have a valid order with _id
      if (!order || !mongoose.Types.ObjectId.isValid(order._id)) {
        throw new Error('Failed to create order with valid ID');
      }

      // Create the payment record
      const payment = await this.paymentService.create({
        order: order._id as unknown as string,
        customer: data.customerId,
        amount: data.amountPaid,
        paymentMethod: data.paymentMethod || 'cash',
        reference: data.reference
      });

      const populatedOrder = await this.orderService.findById(order._id as unknown as string);
      
      if (!populatedOrder) {
        throw new Error('Failed to retrieve created order');
      }

      return { order: populatedOrder, payment };
    } catch (error) {
      console.error('Error in createOrderWithPayment:', error);
      throw error;
    }
  }

  async getAllOrders(): Promise<OrderDocument[]> {
    return this.orderService.findAll();
  }

  async getOrderById(orderId: string): Promise<OrderDocument | null> {
    return this.orderService.findById(orderId);
  }

  async getPaymentByOrderId(orderId: string): Promise<PaymentDocument | null> {
    return this.paymentService.findByOrderId(orderId);
  }
}
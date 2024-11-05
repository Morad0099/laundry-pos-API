import { OrderService } from './order.service';
import { PaymentService } from './payment.service';
import type { CreateOrderPaymentDTO } from '../types/order-payment.types';
import { OrderModel, type OrderDocument } from '../models/order.model';
import type { PaymentDocument } from '../models/payment.model';
import mongoose from 'mongoose';
import { CreateOrderDTO, OrderUpdateDTO } from '../types/order.types';

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

  // async getOrderById(orderId: string): Promise<OrderDocument | null> {
  //   return this.orderService.findById(orderId);
  // }

  async getPaymentByOrderId(orderId: string): Promise<PaymentDocument | null> {
    return this.paymentService.findByOrderId(orderId);
  }

  async updateOrder(orderId: string, orderData: OrderUpdateDTO) {
    try {
      const order = await OrderModel.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      // Type-safe updates with null checks
      if (orderData.orderDate) {
        order.orderDate = new Date(orderData.orderDate);
      }

      if (orderData.orderItems && Array.isArray(orderData.orderItems)) {
        order.orderItems = orderData.orderItems;
      }

      if (typeof orderData.totalAmount === 'number') {
        order.totalAmount = orderData.totalAmount;
      }

      if (orderData.receivedBy) {
        order.receivedBy = orderData.receivedBy;
      }

      if (typeof orderData.amountPaid === 'number') {
        order.amountPaid = orderData.amountPaid;
      }

      if (typeof orderData.outstandingBalance === 'number') {
        order.outstandingBalance = orderData.outstandingBalance;
      }

      if (orderData.paymentMethod) {
        order.paymentMethod = orderData.paymentMethod;
      }

      // Save and populate in one step
      const updatedOrder = await order.save();
      return await OrderModel.findById(updatedOrder._id)
        .populate('customer')
        .exec();
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  async getOrderById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid order ID');
    }
    
    const order = await OrderModel.findById(id)
      .populate('customer')
      .exec();

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }
}
// controllers/order-payment.controller.ts
import { OrderPaymentService } from '../services/order-payment.service';
import type { CreateOrderPaymentDTO } from '../types/order-payment.types';
import { ResponseHandler } from '../utils/response.handler';
import type { ApiResponse, ApiError } from '../types/response.types';
import { CreateOrderDTO, OrderInterface, OrderUpdateDTO } from '../types/order.types';
import { OrderModel } from '../models/order.model';

export class OrderPaymentController {
  constructor(private orderPaymentService: OrderPaymentService) {}

  async createOrderWithPayment(
    body: CreateOrderPaymentDTO
  ): Promise<ApiResponse<any>> {
    try {
      const result = await this.orderPaymentService.createOrderWithPayment(body);
      
      return ResponseHandler.created(
        result,
        'Order and payment created successfully'
      );
    } catch (error) {
      const err = error as ApiError;
      return ResponseHandler.error(
        'Error creating order and payment',
        500,
        err.message
      );
    }
  }

  async getAllOrders(): Promise<ApiResponse<any>> {
    try {
      const orders = await this.orderPaymentService.getAllOrders();
      return ResponseHandler.success(
        orders,
        'Orders retrieved successfully'
      );
    } catch (error) {
      const err = error as ApiError;
      return ResponseHandler.error(
        'Error fetching orders',
        500,
        err.message
      );
    }
  }

  async getOrderWithPayment(orderId: string): Promise<ApiResponse<any>> {
    try {
      const order = await this.orderPaymentService.getOrderById(orderId);
      if (!order) {
        return ResponseHandler.error(
          'Order not found',
          404
        );
      }

      const payment = await this.orderPaymentService.getPaymentByOrderId(orderId);

      return ResponseHandler.success(
        { order, payment },
        'Order and payment retrieved successfully'
      );
    } catch (error) {
      const err = error as ApiError;
      return ResponseHandler.error(
        'Error fetching order and payment',
        500,
        err.message
      );
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<ApiResponse<any>> {
    try {
      const validStatuses = ['DELIVERED', 'PICKED-UP', 'IN-PROCESS', 'CANCELLED'];
      if (!validStatuses.includes(status)) {
        return ResponseHandler.error(
          'Invalid status value. Must be one of: DELIVERED, PICKED-UP, IN-PROCESS, CANCELLED',
          400
        );
      }

      const order = await OrderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true, runValidators: true }
      );
      
      if (!order) {
        return ResponseHandler.error(
          'Order not found',
          404
        );
      }

      return ResponseHandler.success(
        order,
        'Order status updated successfully'
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      return ResponseHandler.error(
        'Error updating order status',
        500,
        (error as ApiError).message
      );
    }
  }

  async bulkUpdateOrderStatus(orderIds: string[], status: string): Promise<ApiResponse<any>> {
    try {
      const validStatuses = ['DELIVERED', 'PICKED-UP', 'IN-PROCESS', 'CANCELLED'];
      if (!validStatuses.includes(status)) {
        return ResponseHandler.error(
          'Invalid status value. Must be one of: DELIVERED, PICKED-UP, IN-PROCESS, CANCELLED',
          400
        );
      }

      const result = await OrderModel.updateMany(
        { _id: { $in: orderIds } },
        { $set: { status } },
        { runValidators: true }
      );

      return ResponseHandler.success(
        result,
        'Orders status updated successfully'
      );
    } catch (error) {
      console.error('Error updating orders status:', error);
      return ResponseHandler.error(
        'Error updating orders status',
        500,
        (error as ApiError).message
      );
    }
  }

  async updateOrder(
    orderId: string, 
    orderData: OrderUpdateDTO
  ): Promise<ApiResponse<any>> {
    try {
      const updatedOrder = await this.orderPaymentService.updateOrder(
        orderId, 
        orderData
      );
      
      return ResponseHandler.success(
        updatedOrder,
        'Order updated successfully'
      );
    } catch (error) {
      const err = error as Error;
      return ResponseHandler.error(
        'Error updating order',
        500,
        err.message
      );
    }
  }

  async getOrderById(orderId: string): Promise<ApiResponse<any>> {
    try {
      const order = await this.orderPaymentService.getOrderById(orderId);
      return ResponseHandler.success(order, 'Order retrieved successfully');
    } catch (error) {
      const err = error as Error;
      return ResponseHandler.error(
        'Error retrieving order',
        500,
        err.message
      );
    }
  }
}
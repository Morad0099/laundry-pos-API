import { OrderModel } from '../models/order.model';
import type { CreateOrderDTO } from '../types/order.types';
import mongoose from 'mongoose';

export class OrderService {
  private async generateOrderNumber(): Promise<string> {
    const lastOrder = await OrderModel.findOne({}, { orderNumber: 1 })
      .sort({ orderNumber: -1 })
      .exec();

    let nextNumber = '0000001';
    
    if (lastOrder?.orderNumber) {
      const lastNumber = parseInt(lastOrder.orderNumber);
      nextNumber = (lastNumber + 1).toString().padStart(7, '0');
    }

    return nextNumber;
  }

  private async generateInvoiceNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const lastOrder = await OrderModel.findOne(
      {
        createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth
        }
      },
      { invoiceNumber: 1 }
    )
    .sort({ invoiceNumber: -1 })
    .exec();

    let sequence = '0001';
    if (lastOrder?.invoiceNumber) {
      const lastSequence = parseInt(lastOrder.invoiceNumber.slice(-4));
      sequence = (lastSequence + 1).toString().padStart(4, '0');
    }

    return `INV${year}${month}${sequence}`;
  }

  async create(orderData: CreateOrderDTO) {
    try {
      const [orderNumber, invoiceNumber] = await Promise.all([
        this.generateOrderNumber(),
        this.generateInvoiceNumber()
      ]);

      const order = new OrderModel({
        ...orderData,
        customer: new mongoose.Types.ObjectId(orderData.customerId),
        orderNumber,
        invoiceNumber,
        status: 'IN-PROCESS' // Set default status
      });

      const savedOrder = await order.save();
      return await OrderModel.findById(savedOrder._id)
        .populate('customer')
        .exec();
        
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async findAll() {
    return await OrderModel.find()
      .populate('customer')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    
    return await OrderModel.findById(id)
      .populate('customer')
      .exec();
  }

  
}
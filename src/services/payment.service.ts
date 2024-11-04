import { PaymentModel, PaymentDocument } from '../models/payment.model';
import type { CreatePaymentDTO } from '../types/payment.types';
import mongoose from 'mongoose';

export class PaymentService {
  async findAll(): Promise<PaymentDocument[]> {
    return await PaymentModel.find()
      .populate('customer')
      .populate('order')
      .sort({ createdAt: -1 })
      .exec();
  }

  async create(paymentData: CreatePaymentDTO): Promise<PaymentDocument> {
    const payment = new PaymentModel({
      ...paymentData,
      order: new mongoose.Types.ObjectId(paymentData.order),
      customer: new mongoose.Types.ObjectId(paymentData.customer)
    });
    return await payment.save();
  }

  async findByOrderId(orderId: string): Promise<PaymentDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(orderId)) return null;
    return await PaymentModel.findOne({ 
      order: new mongoose.Types.ObjectId(orderId) 
    })
    .populate('customer')
    .populate('order')
    .exec();
  }

  async deleteByOrderId(orderId: string): Promise<PaymentDocument | null> {
    if (!mongoose.isValidObjectId(orderId)) return null;
    
    return await PaymentModel.findOneAndDelete({ order: orderId }).exec();
  }
}
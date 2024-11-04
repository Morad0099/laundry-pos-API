import mongoose, { Schema, Document, Model } from 'mongoose';
import { PaymentInterface } from '../types/payment.types';

// Base interface for the schema
export interface IPayment {
  _id: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'cash' | 'bank' | 'mobile_money';
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentDocument extends Document, IPayment {
  _id: mongoose.Types.ObjectId; // Explicitly define _id
}
// Interface for the model
interface PaymentModel extends Model<PaymentDocument> {
  // Add any static methods here if needed
}

const PaymentSchema = new Schema<PaymentDocument>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative']
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank', 'mobile_money'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed'
    },
    reference: {
      type: String
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const PaymentModel = mongoose.model<PaymentDocument, PaymentModel>('Payment', PaymentSchema);
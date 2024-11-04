import mongoose, { Schema, Document, Model } from 'mongoose';
import { OrderInterface } from '../types/order.types';

interface IOrder {
  orderNumber: string;
  customer: mongoose.Types.ObjectId;
  orderDate: Date;
  description: string;
  quantity: number;
  price: number;
  amount: number;
  receivedBy: string;
  invoiceNumber: string;
  status: 'pending' | 'completed' | 'cancelled'| 'processing';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderDocument extends Document, OrderInterface {
  _id: mongoose.Types.ObjectId;
}

const OrderSchema = new Schema<OrderInterface, IOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
      sparse: true
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    orderDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    amount: {
      type: Number,
      required: true
    },
    receivedBy: {
      type: String,
      required: true,
      trim: true
    },
    invoiceNumber: {
      type: String,
      unique: true,
      sparse: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed'], 
      default: 'pending'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const OrderModel = mongoose.model<OrderInterface>('Order', OrderSchema);
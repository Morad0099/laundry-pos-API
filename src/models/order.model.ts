import mongoose, { Schema, Document, Model } from 'mongoose';
import { OrderInterface } from '../types/order.types';

interface OrderItem {
  item: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

interface IOrder {
  orderNumber: string;
  customer: mongoose.Types.ObjectId;
  orderDate: Date;
  orderItems: OrderItem[];
  totalAmount: number;
  receivedBy: string;
  invoiceNumber: string;
  status: 'DELIVERED' | 'PICKED-UP' | 'IN-PROCESS' | 'CANCELLED';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderDocument extends Document, OrderInterface {
  _id: mongoose.Types.ObjectId;
}

const OrderItemSchema = new Schema<OrderItem>({
  item: {
    type: String,
    required: true,
    trim: true
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
  }
});

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
    orderItems: [{
      item: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      amount: {
        type: Number,
        required: true
      }
    }],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    amountPaid: {  
      type: Number,
      required: true,
      min: 0
    },
    outstandingBalance: {
      type: Number,
      required: true,
      default: 0
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank', 'mobile_money'],
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
      enum: ['DELIVERED', 'PICKED-UP', 'IN-PROCESS', 'CANCELLED'],
      default: 'IN-PROCESS'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);


export const OrderModel = mongoose.model<OrderInterface>('Order', OrderSchema);
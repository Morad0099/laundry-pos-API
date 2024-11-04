import mongoose, { Schema } from 'mongoose';
import { OrderInterface } from '../types/order.types';

const OrderSchema = new Schema<OrderInterface>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
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
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Generate order number
OrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const lastOrder = await this.model('Order').findOne({}, {}, { sort: { 'orderNumber': -1 } });
    let nextNumber = '0000001';
    
    if (lastOrder && lastOrder.orderNumber) {
      const lastNumber = parseInt(lastOrder.orderNumber);
      nextNumber = (lastNumber + 1).toString().padStart(7, '0');
    }
    
    this.orderNumber = nextNumber;
  }

  if (!this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    const lastOrder = await this.model('Order').findOne(
      { 
        createdAt: {
          $gte: new Date(date.getFullYear(), date.getMonth(), 1),
          $lt: new Date(date.getFullYear(), date.getMonth() + 1, 1)
        }
      },
      {},
      { sort: { 'invoiceNumber': -1 } }
    );

    let sequence = '0001';
    if (lastOrder && lastOrder.invoiceNumber) {
      const lastSequence = parseInt(lastOrder.invoiceNumber.slice(-4));
      sequence = (lastSequence + 1).toString().padStart(4, '0');
    }

    this.invoiceNumber = `INV${year}${month}${sequence}`;
  }

  next();
});

export const OrderModel = mongoose.model<OrderInterface>('Order', OrderSchema);
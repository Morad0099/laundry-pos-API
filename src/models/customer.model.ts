import mongoose, { Schema } from 'mongoose';
import { CustomerInterface } from '../types/customer.types';

const CustomerSchema = new Schema<CustomerInterface>(
    {
      name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long']
      },
      phone: {
        type: String,
        required: [true, 'Phone is required'],
        trim: true
      },
        address: {
            type: String,
            required: [true, 'Address is required'],
            trim: true
    },
    },
    {
      timestamps: true, // This automatically adds createdAt and updatedAt fields
      versionKey: false // This removes the __v field from documents
    }
  );
  
  // Add any custom methods or middleware here
  CustomerSchema.pre('save', function(next) {
    // You can add pre-save hooks here
    next();
  });
  
  export const CustomerModel = mongoose.model<CustomerInterface>('Customer', CustomerSchema)
import { CustomerModel } from '../models/customer.model';
import type { CustomerInterface,CreateCustomerDTO } from '../types/customer.types';

export class CustomerService {
  // Get all customers
  async getCustomers(): Promise<CustomerInterface[]> {
    return CustomerModel.find();
  }

  // Create a new customer
  async create(customer: CreateCustomerDTO): Promise<CreateCustomerDTO> {
    return CustomerModel.create(customer);
  }

  async findAll(): Promise<CustomerInterface[]> {
    return await CustomerModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<CustomerInterface | null> {
    return await CustomerModel.findById(id);
  }

  async findByPhone(phone: string): Promise<CustomerInterface | null> {
    return await CustomerModel.findOne({ phone });
  }

  async searchCustomers(searchTerm: string): Promise<CustomerInterface[]> {
    const query = {
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { phone: { $regex: searchTerm, $options: 'i' } }
      ]
    };
    
    return await CustomerModel.find(query)
      .sort({ createdAt: -1 })
      .limit(10); // Limit results for better performance
  }

  // This method is useful for frontend autocomplete
  async findCustomersWithDetails(): Promise<CustomerInterface[]> {
    return await CustomerModel.find()
      .select('name phone address')
      .sort({ name: 1 })
      .limit(50);
  }

//   // Get a single customer by ID
//   async getCustomerById(customerId: string): Promise<Customer> {
//     return CustomerModel.findById(customerId);
//   }

//   // Update a customer
//   async updateCustomer(customerId: string, customer: Customer): Promise<Customer | null> {
//     return CustomerModel.findByIdAndUpdate(customerId, customer, { new: true });
//   }

  // Delete a customer
  async deleteCustomer(customerId: string): Promise<CustomerInterface | null> {
    return CustomerModel.findByIdAndDelete(customerId);
  }
}
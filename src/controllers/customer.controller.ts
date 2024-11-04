import { CustomerService } from '../services/customer.service';
import type { CreateCustomerDTO, CustomerInterface } from '../types/customer.types';
import { ResponseHandler } from '../utils/response.handler';
import { ApiResponse, ApiError } from '../types/response.types';

export class CustomerController{
    constructor(private customerService: CustomerService) {}

    async getAllCustomers(): Promise<ApiResponse<CustomerInterface[]>> {
        try {
          const customers = await this.customerService.findAll();
          return ResponseHandler.success(
            customers,
            'Customers retrieved successfully'
          );
        } catch (error) {
          // Type guard for error
          const err = error as ApiError;
          return ResponseHandler.error<CustomerInterface[]>(
            'Error fetching customers',
            500,
            err.message
          );
        }
      }

      async deleteCustomer(customerId: string): Promise<ApiResponse<CustomerInterface | null>> {
        try {
          const customer = await this.customerService.deleteCustomer(customerId);
      
          if (!customer) {
            // Customer does not exist
            return ResponseHandler.error<CustomerInterface | null>(
              'Customer not found',
              404
            );
          }
      
          return ResponseHandler.success(
            customer,
            'Customer deleted successfully'
          );
        } catch (error) {
          // Handle any other unexpected errors
          const err = error as ApiError;
          return ResponseHandler.error<CustomerInterface | null>(
            'Error deleting customer',
            500,
            err.message
          );
        }
      }
      

      async createCustomer(body: CreateCustomerDTO): Promise<ApiResponse<CreateCustomerDTO>> {
        try {
          const existingCustomer = await this.customerService.findByPhone(body.phone);
          if (existingCustomer) {
            return ResponseHandler.badRequest<CreateCustomerDTO>(
              'Customer with this phone number already exists'
            );
          }
    
          const newCustomer = await this.customerService.create(body);
          return ResponseHandler.created(
            newCustomer,
            'Customer created successfully'
          );
        } catch (error) {
          const err = error as ApiError;
          return ResponseHandler.error<CreateCustomerDTO>(
            'Error creating customer',
            500,
            err.message
          );
        }
      }

      async searchCustomers(searchTerm: string): Promise<ApiResponse<CustomerInterface[]>> {
        try {
          const customers = await this.customerService.searchCustomers(searchTerm);
          return ResponseHandler.success(
            customers,
            'Customers search completed'
          );
        } catch (error) {
          const err = error as ApiError;
          return ResponseHandler.error<CustomerInterface[]>(
            'Error searching customers',
            500,
            err.message
          );
        }
      }
    
      async getCustomersForAutocomplete(): Promise<ApiResponse<CustomerInterface[]>> {
        try {
          const customers = await this.customerService.findCustomersWithDetails();
          return ResponseHandler.success(
            customers,
            'Customers retrieved for autocomplete'
          );
        } catch (error) {
          const err = error as ApiError;
          return ResponseHandler.error<CustomerInterface[]>(
            'Error fetching customers for autocomplete',
            500,
            err.message
          );
        }
      }
    
}
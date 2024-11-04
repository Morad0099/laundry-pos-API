export interface CustomerInterface{
    id: string;
    name: string;
    phone: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

// DTO (Data Transfer Object) for creating a new customer
// This represents the data that will be sent from the client when creating a customer
export interface CreateCustomerDTO {
    name: string;     // Required field
    phone: string;   // Required field
    address: string;
}




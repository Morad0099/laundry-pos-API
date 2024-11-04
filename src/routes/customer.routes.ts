import { Elysia, t } from 'elysia';
import { CustomerController } from '../controllers/customer.controller';
import { CustomerService } from '../services/customer.service';
import { createProtectedRoute } from '../middleware/setup.middleware';

const customerController = new CustomerController(new CustomerService());

const router = new Elysia();

export const customerRoutes = createProtectedRoute(router)

  .post('/customers/add', 
    async ({ body }) => {
      return await customerController.createCustomer(body);
    }, 
    {
      body: t.Object({
        name: t.String(),
        phone: t.String(),
        address: t.String()})
    }
  )
  .get('/customers/get',
    async ({ query }) => {
      if (query?.search) {
        return await customerController.searchCustomers(query.search);
      }
      return await customerController.getAllCustomers();
    },
    {
      query: t.Optional(t.Object({
        search: t.Optional(t.String())
      }))
    }
  )
  .delete('/customers/delete/:id',
    async ({ params }) => {
      return await customerController.deleteCustomer(params.id);
    }
  )
  .get('/customers/search/:term',
    async ({ params }) => {
      return await customerController.searchCustomers(params.term);
    },
    {
      params: t.Object({
        term: t.String()
      })
    }
  )

  // Autocomplete endpoint
  .get('/customers/autocomplete',
    async () => {
      return await customerController.getCustomersForAutocomplete();
    }
  )


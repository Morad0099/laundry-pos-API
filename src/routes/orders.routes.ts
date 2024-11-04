// routes/order.routes.ts
import { Elysia, t } from 'elysia';
import { OrderService } from '../services/order.service';
import { PaymentService } from '../services/payment.service';
import { OrderPaymentService } from '../services/order-payment.service';
import { OrderPaymentController } from '../controllers/order-payment.controller';
import { CreateOrderPaymentDTO } from '../types/order-payment.types';
import { createProtectedRoute } from '../middleware/setup.middleware';

// Initialize services and controller
const orderService = new OrderService();
const paymentService = new PaymentService();
const orderPaymentService = new OrderPaymentService(orderService, paymentService);
const orderPaymentController = new OrderPaymentController(orderPaymentService);

// Create protected router
const router = new Elysia(); // Optional: add prefix for all routes

export const orderRoutes = createProtectedRoute(router)
  .post('/orders/add', async ({ body }) => {
    const orderData = body as CreateOrderPaymentDTO;
    return await orderPaymentController.createOrderWithPayment(orderData);
  })
  .get('/orders/get', async () => {
    return await orderPaymentController.getAllOrders();
  })
  .get('/orders/get/:orderId', async ({ params: { orderId } }) => {
    return await orderPaymentController.getOrderWithPayment(orderId);
  })
  .patch('/orders/status/:id',
    async ({ params, body }) => {
      return await orderPaymentController.updateOrderStatus(params.id, body.status);
    },
    {
      params: t.Object({
        id: t.String()
      }),
      body: t.Object({
        status: t.String()
      })
    }
  )

  .patch('/orders/bulk-status',
    async ({ body }) => {
      return await orderPaymentController.bulkUpdateOrderStatus(body.orderIds, body.status);
    },
    {
      body: t.Object({
        orderIds: t.Array(t.String()),
        status: t.String()
      })
    }
  );

// // Type validation for request body
// const createOrderSchema = {
//   body: {
//     type: 'object',
//     properties: {
//       customerId: { type: 'string' },
//       orderDate: { type: 'string', format: 'date-time' },
//       description: { type: 'string' },
//       quantity: { type: 'number', minimum: 1 },
//       price: { type: 'number', minimum: 0 },
//       amount: { type: 'number', minimum: 0 },
//       receivedBy: { type: 'string' },
//       cash: { type: 'number', minimum: 0 },
//       paymentMethod: { 
//         type: 'string', 
//         enum: ['cash', 'bank', 'mobile_money'],
//         default: 'cash'
//       },
//       reference: { type: 'string', optional: true }
//     },
//     required: ['customerId', 'description', 'quantity', 'price', 'amount', 'receivedBy', 'cash']
//   }
// };

// // Create a version with request validation
// export const validatedOrderRoutes = createProtectedRoute(router)
//   .post('/orders', 
//     {
//       body: createOrderSchema.body,
//       error: ({ code, error }) => {
//         return {
//           status: false,
//           message: `Validation error: ${error.message}`,
//           code,
//           error: error.message
//         };
//       }
//     },
//     async ({ body }) => {
//       const orderData = body as CreateOrderPaymentDTO;
//       return await orderPaymentController.createOrderWithPayment(orderData);
//     }
//   )
//   .get('/orders', async () => {
//     return await orderPaymentController.getAllOrders();
//   })
//   .get('/orders/:orderId', 
//     {
//       params: {
//         type: 'object',
//         properties: {
//           orderId: { type: 'string', minLength: 24, maxLength: 24 }
//         },
//         required: ['orderId']
//       }
//     },
//     async ({ params: { orderId } }) => {
//       return await orderPaymentController.getOrderWithPayment(orderId);
//     }
//   );

export default orderRoutes;
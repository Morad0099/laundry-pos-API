// routes/order.routes.ts
import { Elysia, t } from 'elysia';
import { OrderService } from '../services/order.service';
import { PaymentService } from '../services/payment.service';
import { OrderPaymentService } from '../services/order-payment.service';
import { OrderPaymentController } from '../controllers/order-payment.controller';
import { CreateOrderPaymentDTO } from '../types/order-payment.types';
import { createProtectedRoute } from '../middleware/setup.middleware';
import { OrderUpdateDTO } from '../types/order.types';

// Initialize services and controller
const orderService = new OrderService();
const paymentService = new PaymentService();
const orderPaymentService = new OrderPaymentService(orderService, paymentService);
const orderPaymentController = new OrderPaymentController(orderPaymentService);
const PaymentMethodEnum = t.Enum({
  cash: 'cash',
  bank: 'bank',
  mobile_money: 'mobile_money'
});
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
  .put('/orders/update/:id',
    async ({ params: { id }, body }) => {
      // Cast the body to OrderUpdateDTO since we've validated it
      return await orderPaymentController.updateOrder(id, body as OrderUpdateDTO);
    },
    {
      params: t.Object({
        id: t.String()
      }),
      body: t.Object({
        orderDate: t.Optional(t.String()),
        orderItems: t.Optional(t.Array(
          t.Object({
            item: t.String(),
            description: t.String(),
            quantity: t.Number(),
            price: t.Number(),
            amount: t.Number()
          })
        )),
        totalAmount: t.Optional(t.Number()),
        amountPaid: t.Optional(t.Number()),
        outstandingBalance: t.Optional(t.Number()),
        paymentMethod: t.Optional(PaymentMethodEnum),
        receivedBy: t.Optional(t.String())
      })
    }
  )
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

export default orderRoutes;
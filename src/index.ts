// src/index.ts
import { Elysia } from 'elysia';
import { customerRoutes } from './routes/customer.routes';
import { connectDB } from './config/database';
import { adminRoutes } from './routes/admin.routes';
import { authRoutes, protectedAuthRoutes } from './routes/auth.routes';
import { cors } from '@elysiajs/cors';
import orderRoutes from './routes/orders.routes';
import { dashboardRoutes } from './routes/dashboard.routes';

if (!process.env.JWT_ACCESS_SECRET) {
  console.error('JWT_ACCESS_SECRET is not set');
  process.exit(1);
}

// Connect to MongoDB
connectDB();

// Create API router with /api prefix
const api = new Elysia({ prefix: '/api' })
.use(cors({
  origin: '*', // Or specify your frontend domain(s)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 3600,
}));
// Group protected routes under /api
const protectedRoutes = api
  .use(customerRoutes)
  .use(adminRoutes)
  .use(protectedAuthRoutes)
  .use(orderRoutes)
  .use(dashboardRoutes)

// Create main app and add both protected and public routes
const app = new Elysia()
.use(cors({  // Also add CORS to main app for auth routes
  origin: '*', // Or specify your frontend domain(s)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 3600,
}))
  .use(authRoutes)  // Public routes without /api prefix
  .use(protectedRoutes)  // Protected routes under /api
  .listen(3013);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
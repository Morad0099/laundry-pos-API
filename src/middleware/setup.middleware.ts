// src/middleware/setup.middleware.ts
import { Elysia } from "elysia";
import { authGuard } from "../guards/auth.guard";
import { authMiddleware } from "./auth.middleware";
import { errorHandler } from "../handlers/error.handler";

// Create a function that returns the middleware setup
export const createProtectedRoute = (app: Elysia) => {
  return app.use(authGuard).use(authMiddleware).use(errorHandler);
};

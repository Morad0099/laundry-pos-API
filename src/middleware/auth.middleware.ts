import { Elysia } from "elysia";
import jwt from "jsonwebtoken";
import { AdminModel } from "../models/admin.model";
import { TokenPayload, AdminRole } from "../types/admin.types";
import { AuthService } from "../services/auth.service";
import { CurrentAdmin } from "../types/context.types";

const authService = new AuthService();

export const authMiddleware = new Elysia().derive(
  { as: "global" },
  async ({
    request,
    set,
  }): Promise<{ currentAdmin: CurrentAdmin; currentToken: string }> => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      throw new Error("No token provided");
    }

    try {
      const token = authHeader.split(" ")[1];
      if (!process.env.JWT_ACCESS_SECRET) {
        throw new Error("JWT_ACCESS_SECRET not configured");
      }

      // Check blacklist first
      const isBlacklisted = await authService.isTokenBlacklisted(token);
      if (isBlacklisted) {
        set.status = 401;
        throw new Error("Token has been invalidated");
      }

      const payload = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET
      ) as TokenPayload;

      const admin = await AdminModel.findById(payload.id);

      if (!admin) {
        set.status = 401;
        throw new Error("Invalid token");
      }

      // Check if admin is still active
      // if (!admin.isActive) {
      //     set.status = 401;
      //     throw new Error('Account is inactive');
      // }

      return {
        currentAdmin: {
          id: admin._id.toString(),
          role: admin.role as AdminRole,
        },
        currentToken: token,
      };
    } catch (error) {
      // Set proper status code for token errors
      set.status = 401;
      throw new Error(error instanceof Error ? error.message : "Invalid token");
    }
  }
);

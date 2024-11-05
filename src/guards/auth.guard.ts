// src/guards/auth.guard.ts
import { Elysia } from "elysia";

export const authGuard = new Elysia().derive(
  { as: "global" },
  ({ request, set }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      set.status = 401;
      throw new Error("No token provided");
    }
  }
);

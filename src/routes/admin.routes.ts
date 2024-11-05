// src/routes/admin.routes.ts
import { Elysia, t } from "elysia";
import { AdminController } from "../controllers/admin.controller";
import { AdminService } from "../services/admin.service";
import { AdminRole } from "../types/admin.types";
import { createProtectedRoute } from "../middleware/setup.middleware";

const adminController = new AdminController(new AdminService());

// Create base router
const router = new Elysia();

// Create protected routes
export const adminRoutes = createProtectedRoute(router)
  .post(
    "/admin/add",
    async ({ body }) => {
      return await adminController.createAdmin(body);
    },
    {
      body: t.Object({
        name: t.String(),
        phone: t.String(),
        role: t.Enum(AdminRole),
        password: t.Optional(t.String()),
      }),
    }
  )
  .get("/admin/get", async () => {
    return await adminController.getAllAdmins();
  })
  .get("/admin/profile/get", async ({ currentAdmin }) => {
    return await adminController.getProfile(currentAdmin.id);
  })
  .put(
    "/admin/profile/update",
    async ({ currentAdmin, body }) => {
      return await adminController.updateProfile(currentAdmin.id, body);
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        phone: t.Optional(t.String()),
        // Add other updateable fields here
      }),
    }
  )
  .post(
    "/admin/change-password",
    async ({ currentAdmin, body }) => {
      return await adminController.changePassword(
        currentAdmin.id,
        body.currentPassword,
        body.newPassword
      );
    },
    {
      body: t.Object({
        currentPassword: t.String(),
        newPassword: t.String({
          minLength: 8,
          maxLength: 50,
        }),
      }),
    }
  )
  .delete("/admin/delete/:id", async ({ params }) => {
    return await adminController.deleteAdmin(params.id);
  });

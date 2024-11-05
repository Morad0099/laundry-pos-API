import { AdminService } from "../services/admin.service";
import { AdminInterface, CreateAdminDTO } from "../types/admin.types";
import { ResponseHandler } from "../utils/response.handler";
import { ApiResponse, ApiError } from "../types/response.types";

export class AdminController {
  constructor(private adminService: AdminService) {}

  async getAllAdmins(): Promise<ApiResponse<AdminInterface[]>> {
    try {
      const admins = await this.adminService.findAll();
      return ResponseHandler.success(admins, "Admins retrieved successfully");
    } catch (error) {
      const err = error as ApiError;
      return ResponseHandler.error<AdminInterface[]>(
        "Error fetching admins",
        500,
        err.message
      );
    }
  }

  async createAdmin(
    body: CreateAdminDTO
  ): Promise<ApiResponse<AdminInterface>> {
    try {
      const existingAdmin = await this.adminService.findByPhone(body.phone);
      if (existingAdmin) {
        return ResponseHandler.badRequest<AdminInterface>(
          "Admin with this phone number already exists"
        );
      }
      const newAdmin = await this.adminService.create(body);
      return ResponseHandler.created(newAdmin, "Admin created successfully");
    } catch (error) {
      const err = error as ApiError;
      return ResponseHandler.error<AdminInterface>(
        "Error creating admin",
        500,
        err.message
      );
    }
  }

  async getProfile(adminId: string): Promise<ApiResponse<AdminInterface>> {
    try {
      const profile = await this.adminService.getProfile(adminId);

      if (!profile) {
        return ResponseHandler.notFound("Profile not found");
      }

      return ResponseHandler.success(profile, "Profile retrieved successfully");
    } catch (error) {
      const err = error as ApiError;
      return ResponseHandler.error("Error fetching profile", 500, err.message);
    }
  }

  async updateProfile(
    adminId: string,
    updateData: Partial<AdminInterface>
  ): Promise<ApiResponse<AdminInterface>> {
    try {
      const updatedProfile = await this.adminService.updateProfile(
        adminId,
        updateData
      );

      if (!updatedProfile) {
        return ResponseHandler.notFound("Profile not found");
      }

      return ResponseHandler.success(
        updatedProfile,
        "Profile updated successfully"
      );
    } catch (error) {
      const err = error as ApiError;
      return ResponseHandler.error("Error updating profile", 500, err.message);
    }
  }

  async changePassword(
    adminId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<null>> {
    try {
      const success = await this.adminService.changePassword(
        adminId,
        currentPassword,
        newPassword
      );

      if (!success) {
        return ResponseHandler.badRequest("Current password is incorrect");
      }

      return ResponseHandler.success(null, "Password changed successfully");
    } catch (error) {
      const err = error as ApiError;
      return ResponseHandler.error("Error changing password", 500, err.message);
    }
  }

  async deleteAdmin(
    adminId: string
  ): Promise<ApiResponse<AdminInterface | null>> {
    try {
      const admin = await this.adminService.deleteAdmin(adminId);

      if (!admin) {
        // Customer does not exist
        return ResponseHandler.error<AdminInterface | null>(
          "Admin not found",
          404
        );
      }

      return ResponseHandler.success(admin, "Admin deleted successfully");
    } catch (error) {
      // Handle any other unexpected errors
      const err = error as ApiError;
      return ResponseHandler.error<AdminInterface | null>(
        "Error deleting admin",
        500,
        err.message
      );
    }
  }
}

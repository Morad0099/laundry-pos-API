import { AdminModel } from "../models/admin.model";
import { CreateAdminDTO, AdminInterface } from "../types/admin.types";
import bcrypt from "bcrypt";

export class AdminService {
  private readonly DEFAULT_PASSWORD = "12345678";

  // Get all admins
  async getAdmins(): Promise<AdminInterface[]> {
    return AdminModel.find();
  }

  // Create a new admin
  async create(admin: CreateAdminDTO): Promise<AdminInterface> {
    try {
      // Set default password if not provided
      const password = admin.password || this.DEFAULT_PASSWORD;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = await AdminModel.create({
        ...admin,
        password: hashedPassword,
      });

      // Return admin without password
      return newAdmin.toJSON();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating admin: ${error.message}`);
      } else {
        throw new Error("Error creating admin");
      }
    }
  }

  async getProfile(adminId: string): Promise<AdminInterface | null> {
    try {
      const admin = await AdminModel.findById(adminId).select(
        "-password -refreshToken -passwordResetToken -passwordResetExpires"
      );

      if (!admin) {
        return null;
      }

      return admin;
    } catch (error) {
      throw new Error("Error fetching admin profile");
    }
  }

  async updateProfile(
    adminId: string,
    updateData: Partial<AdminInterface>
  ): Promise<AdminInterface | null> {
    try {
      // Ensure these fields can't be updated through this method
      const protectedFields = [
        "password",
        "role",
        "refreshToken",
        "passwordResetToken",
        "passwordResetExpires",
      ];
      protectedFields.forEach((field) => {
        delete updateData[field as keyof typeof updateData];
      });

      const updatedAdmin = await AdminModel.findByIdAndUpdate(
        adminId,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
          select:
            "-password -refreshToken -passwordResetToken -passwordResetExpires",
        }
      );

      if (!updatedAdmin) {
        return null;
      }

      return updatedAdmin;
    } catch (error) {
      throw new Error("Error updating admin profile");
    }
  }

  // Change admin password
  async changePassword(
    adminId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      const admin = await AdminModel.findById(adminId).select("+password");
      if (!admin) return false;

      // Verify current password
      const isPasswordValid = await admin.comparePassword(currentPassword);
      if (!isPasswordValid) return false;

      // Update password
      admin.password = newPassword;
      await admin.save();

      return true;
    } catch (error) {
      throw new Error("Error changing password");
    }
  }

  async findAll(): Promise<AdminInterface[]> {
    return await AdminModel.find().select("-password").sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<AdminInterface | null> {
    return await AdminModel.findById(id);
  }

  async findByPhone(phone: string): Promise<AdminInterface | null> {
    return await AdminModel.findOne({ phone });
  }

  async deleteAdmin(adminId: string): Promise<AdminInterface | null> {
    return AdminModel.findByIdAndDelete(adminId);
  }
}

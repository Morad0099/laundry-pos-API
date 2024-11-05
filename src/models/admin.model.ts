import mongoose, { Schema } from "mongoose";
import { AdminInterface, AdminRole } from "../types/admin.types";
import bcrypt from "bcrypt";

const AdminSchema = new Schema<AdminInterface>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: Object.values(AdminRole),
        message: "{VALUE} is not a valid role",
      },
      default: AdminRole.ADMIN,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // This will exclude password by default in queries
    },
    refreshToken: {
      type: String,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true, // This automatically adds createdAt and updatedAt fields
    versionKey: false, // This removes the __v field from documents
  }
);

// Method to compare password
AdminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

export const AdminModel = mongoose.model<AdminInterface>("Admin", AdminSchema);

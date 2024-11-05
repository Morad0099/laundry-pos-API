// src/services/auth.service.ts
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AdminModel } from "../models/admin.model";
import {
  LoginDTO,
  AuthResponse,
  TokenPayload,
  AdminInterface,
} from "../types/admin.types";
import { BlacklistedTokenModel } from "../models/blacklisted-token.model";

export class AuthService {
  private readonly JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
  private readonly JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY;
  private readonly JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY;
  private readonly PASSWORD_RESET_SECRET = process.env.PASSWORD_RESET_SECRET!;
  private readonly PASSWORD_RESET_EXPIRY = process.env.PASSWORD_RESET_EXPIRY;

  async login(credentials: LoginDTO): Promise<AuthResponse | null> {
    const admin = await AdminModel.findOne({ phone: credentials.phone }).select(
      "+password"
    );

    if (!admin) return null;

    const isPasswordValid = await admin.comparePassword(credentials.password);
    if (!isPasswordValid) return null;

    // Generate tokens
    const accessToken = this.generateAccessToken(admin);
    const refreshToken = this.generateRefreshToken(admin);

    // Save refresh token
    admin.refreshToken = refreshToken;
    // admin.lastLogin = new Date();
    await admin.save();

    return {
      admin: this.sanitizeAdmin(admin),
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string): Promise<{ accessToken: string } | null> {
    try {
      const payload = jwt.verify(
        token,
        this.JWT_REFRESH_SECRET
      ) as TokenPayload;
      const admin = await AdminModel.findById(payload.id).select(
        "+refreshToken"
      );

      if (!admin || admin.refreshToken !== token) {
        return null;
      }

      const accessToken = this.generateAccessToken(admin);
      return { accessToken };
    } catch {
      return null;
    }
  }

  async generatePasswordResetToken(phone: string): Promise<string | null> {
    const admin = await AdminModel.findOne({ phone });
    if (!admin) return null;

    const resetToken = crypto.randomBytes(32).toString("hex");
    admin.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .update(this.PASSWORD_RESET_SECRET)
      .digest("hex");

    admin.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
    await admin.save();

    return resetToken;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .update(this.PASSWORD_RESET_SECRET)
      .digest("hex");

    const admin = await AdminModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!admin) return false;

    admin.password = newPassword;
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;
    await admin.save();

    return true;
  }

  private generateAccessToken(admin: AdminInterface): string {
    const payload: TokenPayload = {
      id: admin._id,
      role: admin.role,
    };

    return jwt.sign(payload, this.JWT_ACCESS_SECRET, {
      expiresIn: this.JWT_ACCESS_EXPIRY,
    });
  }

  private generateRefreshToken(admin: AdminInterface): string {
    const payload: TokenPayload = {
      id: admin._id,
      role: admin.role,
    };

    return jwt.sign(payload, this.JWT_REFRESH_SECRET, {
      expiresIn: this.JWT_REFRESH_EXPIRY,
    });
  }

  private sanitizeAdmin(admin: AdminInterface) {
    const sanitized = (admin as any).toObject();
    delete sanitized.password;
    delete sanitized.refreshToken;
    return sanitized;
  }

  async logout(
    adminId: string,
    accessToken: string,
    refreshToken: string
  ): Promise<boolean> {
    try {
      // Find admin and verify refresh token
      const admin = await AdminModel.findById(adminId).select("+refreshToken");

      if (!admin || admin.refreshToken !== refreshToken) {
        return false;
      }

      // Clear refresh token
      admin.refreshToken = undefined;
      await admin.save();

      // Blacklist the access token
      await this.blacklistToken(accessToken);

      return true;
    } catch (error) {
      throw new Error("Logout failed");
    }
  }

  private async blacklistToken(token: string): Promise<void> {
    try {
      // Decode token to get expiry
      const decoded = jwt.decode(token) as TokenPayload;
      if (!decoded.exp) throw new Error("Invalid token");

      // Store in blacklist
      await BlacklistedTokenModel.create({
        token,
        expiresAt: new Date(decoded.exp * 1000), // Convert UNIX timestamp to Date
      });
    } catch (error) {
      throw new Error("Token blacklisting failed");
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await BlacklistedTokenModel.findOne({ token });
    return !!blacklistedToken;
  }
}

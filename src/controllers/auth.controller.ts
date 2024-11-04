// src/controllers/auth.controller.ts
import { AuthService } from '../services/auth.service';
import { LoginDTO, PasswordResetDTO } from '../types/admin.types';
import { ResponseHandler } from '../utils/response.handler';
import { ApiResponse, ApiError } from '../types/response.types';

export class AuthController {
    constructor(private authService: AuthService) {}

    async login(credentials: LoginDTO): Promise<ApiResponse<any>> {
        try {
            const result = await this.authService.login(credentials);
            if (!result) {
                return ResponseHandler.unauthorized('Invalid credentials');
            }

            return ResponseHandler.success(result, 'Login successful');
        } catch (error) {
            const err = error as ApiError;
            return ResponseHandler.error(
                'Login failed',
                500,
                err.message
            );
        }
    }

    async refreshToken(token: string): Promise<ApiResponse<any>> {
        try {
            const result = await this.authService.refreshToken(token);
            if (!result) {
                return ResponseHandler.unauthorized('Invalid refresh token');
            }

            return ResponseHandler.success(result, 'Token refreshed');
        } catch (error) {
            const err = error as ApiError;
            return ResponseHandler.error(
                'Token refresh failed',
                500,
                err.message
            );
        }
    }

    async forgotPassword(phone: string): Promise<ApiResponse<any>> {
        try {
            const resetToken = await this.authService.generatePasswordResetToken(phone);
            if (!resetToken) {
                return ResponseHandler.notFound('Admin not found');
            }

            // Here you would typically send this token via email/SMS
            // For development, we'll return it
            return ResponseHandler.success({ resetToken }, 'Reset token generated');
        } catch (error) {
            const err = error as ApiError;
            return ResponseHandler.error(
                'Password reset failed',
                500,
                err.message
            );
        }
    }

    async resetPassword(data: PasswordResetDTO): Promise<ApiResponse<any>> {
        try {
            const success = await this.authService.resetPassword(
                data.token,
                data.newPassword
            );

            if (!success) {
                return ResponseHandler.badRequest('Invalid or expired reset token');
            }

            return ResponseHandler.success(null, 'Password reset successful');
        } catch (error) {
            const err = error as ApiError;
            return ResponseHandler.error(
                'Password reset failed',
                500,
                err.message
            );
        }
    }

    async logout(adminId: string, accessToken: string, refreshToken: string): Promise<ApiResponse<any>> {
        try {
            const success = await this.authService.logout(
                adminId,
                accessToken,
                refreshToken
            );
            
            if (!success) {
                return ResponseHandler.unauthorized('Invalid session');
            }

            return ResponseHandler.success(null, 'Logged out successfully');
        } catch (error) {
            const err = error as ApiError;
            return ResponseHandler.error(
                'Logout failed',
                500,
                err.message
            );
        }
    }
}
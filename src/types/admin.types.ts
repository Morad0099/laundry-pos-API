export enum AdminRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER'
}

export interface AdminInterface {
    _id: string;
    name: string;
    phone: string;
    role: AdminRole;
    password: string;
    refreshToken?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    createdAt: Date;
    updatedAt: Date;
}

// DTO (Data Transfer Object) for creating a new customer
export interface CreateAdminDTO {
    name: string;
    phone: string;
    role: AdminRole;
    password?: string;
}

export interface LoginDTO {
    phone: string;
    password: string;
}

export interface AuthResponse {
    admin: Omit<AdminInterface, 'password' | 'refreshToken'>;
    accessToken: string;
    refreshToken: string;
}

export interface TokenPayload {
    id: string;
    role: AdminRole;
    exp?: number;
}

export interface PasswordResetDTO {
    token: string;
    newPassword: string;
}
import { AdminInterface, AdminRole } from './admin.types';

export interface CurrentAdmin {
    id: string;
    role: AdminRole;
}

export interface AuthContext {
    currentAdmin: CurrentAdmin;
    currentToken: string;
}
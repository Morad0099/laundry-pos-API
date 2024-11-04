import { Elysia, t } from "elysia";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { createProtectedRoute } from "../middleware/setup.middleware";
import { AuthContext, CurrentAdmin } from "../types/context.types";

interface LogoutContext {
    body: {
        refreshToken: string;
    };
    currentAdmin: CurrentAdmin;
    currentToken: string;
}

const authController = new AuthController(new AuthService());

// Public routes
export const authRoutes = new Elysia({ prefix: '/auth' })
    .post('/login',
        async ({ body }) => authController.login(body),
        {
            body: t.Object({
                phone: t.String(),
                password: t.String()
            })
        }
    )
    .post('/refresh-token',
        async ({ body }) => authController.refreshToken(body.token),
        {
            body: t.Object({
                token: t.String()
            })
        }
    )
    .post('/forgot-password',
        async ({ body }) => authController.forgotPassword(body.phone),
        {
            body: t.Object({
                phone: t.String()
            })
        }
    )
    .post('/reset-password',
        async ({ body }) => authController.resetPassword(body),
        {
            body: t.Object({
                token: t.String(),
                newPassword: t.String()
            })
        }
    );
    const router = new Elysia();

    // Protected routes (auth required)
export const protectedAuthRoutes = createProtectedRoute(router)
.post('/logout',
    async ({ body, currentAdmin, currentToken }: LogoutContext) => {
        if (!currentAdmin || !currentToken) {
            throw new Error('Unauthorized');
        }
        
        return await authController.logout(
            currentAdmin.id,
            currentToken,
            body.refreshToken
        );
    },
    {
        body: t.Object({
            refreshToken: t.String()
        })
    }
);
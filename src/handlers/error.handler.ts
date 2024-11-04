// src/handlers/error.handler.ts
import { Elysia } from 'elysia';

export const errorHandler = new Elysia()
    .onError(({ error, set }) => {
        if (error.message === 'No token provided' || error.message === 'Invalid token') {
            set.status = 401;
            return {
                status: false,
                message: error.message,
                statusCode: 401,
                data: null
            };
        }

        set.status = 500;
        return {
            status: false,
            message: 'Internal server error',
            statusCode: 500,
            data: null,
            error: error.message
        };
    });
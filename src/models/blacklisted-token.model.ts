import mongoose, { Schema } from "mongoose";

interface BlacklistedToken {
    token: string;
    expiresAt: Date;
}

const BlacklistedTokenSchema = new Schema<BlacklistedToken>({
    token: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // Document will be automatically deleted after expiry
    }
});

export const BlacklistedTokenModel = mongoose.model<BlacklistedToken>('BlacklistedToken', BlacklistedTokenSchema);


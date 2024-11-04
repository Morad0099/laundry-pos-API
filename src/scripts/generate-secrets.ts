// scripts/generate-secrets.ts
import crypto from 'crypto';

const generateSecret = () => crypto.randomBytes(64).toString('hex');

const secrets = {
    JWT_ACCESS_SECRET: generateSecret(),
    JWT_REFRESH_SECRET: generateSecret(),
    PASSWORD_RESET_SECRET: generateSecret()
};

// Create .env format
const envFormat = Object.entries(secrets)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

console.log('\n=== Copy these to your .env file ===\n');
console.log(envFormat);
console.log('\n=== End of secrets ===\n');
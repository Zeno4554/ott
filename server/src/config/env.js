import dotenv from 'dotenv';

dotenv.config();

const required = [
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
];

for (const key of required) {
  if (!process.env[key]) {
    // Fail fast at boot rather than surfacing cryptic errors deep in a request.
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  tokenTtlMs: {
    emailVerification: Number(process.env.EMAIL_VERIFICATION_TTL_MS) || 86400000,
    passwordReset: Number(process.env.PASSWORD_RESET_TTL_MS) || 3600000,
  },
  emailFrom: process.env.EMAIL_FROM || 'OTT Platform <no-reply@ottplatform.dev>',
  isProd: process.env.NODE_ENV === 'production',
};

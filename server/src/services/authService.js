import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { generateOpaqueToken, hashToken } from '../utils/token.js';
import { sendVerificationEmail, sendPasswordResetEmail } from './emailService.js';
import { env } from '../config/env.js';

function toPublicUser(user) {
  const { password, ...publicUser } = user;
  return publicUser;
}

async function issueTokenPair(user) {
  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id });

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken };
}

export async function register({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Same message regardless of which field collided — don't leak which
    // emails are registered beyond what's unavoidable from the unique check.
    throw new ApiError(409, 'An account with this email already exists');
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  const { raw, hash } = generateOpaqueToken();
  await prisma.verificationToken.create({
    data: {
      tokenHash: hash,
      userId: user.id,
      expiresAt: new Date(Date.now() + env.tokenTtlMs.emailVerification),
    },
  });

  await sendVerificationEmail(user.email, raw);

  return toPublicUser(user);
}

export async function verifyEmail(rawToken) {
  const tokenHash = hashToken(rawToken);

  const record = await prisma.verificationToken.findUnique({
    where: { tokenHash },
  });

  if (!record || record.expiresAt < new Date()) {
    throw new ApiError(400, 'Verification link is invalid or has expired');
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: true },
    }),
    prisma.verificationToken.delete({
      where: { id: record.id },
    }),
  ]);
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const passwordMatches = await comparePassword(password, user.password);
  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.emailVerified) {
    throw new ApiError(403, 'Please verify your email before logging in');
  }

  const tokens = await issueTokenPair(user);
  return { user: toPublicUser(user), ...tokens };
}

export async function refresh(rawRefreshToken) {
  if (!rawRefreshToken) {
    throw new ApiError(401, 'Refresh token missing');
  }

  let payload;
  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const tokenHash = hashToken(rawRefreshToken);
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!stored || stored.expiresAt < new Date()) {
    throw new ApiError(401, 'Refresh token not recognized');
  }

  if (stored.revoked) {
    // Reuse of an already-rotated-out token is a strong signal of theft —
    // revoke every refresh token for this user to force re-authentication.
    await prisma.refreshToken.updateMany({
      where: { userId: stored.userId },
      data: { revoked: true },
    });
    throw new ApiError(401, 'Refresh token reuse detected — please log in again');
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    throw new ApiError(401, 'User no longer exists');
  }

  // Rotate: revoke the used token and issue a brand new pair.
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revoked: true },
  });

  const tokens = await issueTokenPair(user);
  return { user: toPublicUser(user), ...tokens };
}

export async function logout(rawRefreshToken) {
  if (!rawRefreshToken) return;
  const tokenHash = hashToken(rawRefreshToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { revoked: true },
  });
}

export async function forgotPassword(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  // Always respond as if successful — don't reveal whether the email exists.
  if (!user) return;

  const { raw, hash } = generateOpaqueToken();
  await prisma.passwordResetToken.create({
    data: {
      tokenHash: hash,
      userId: user.id,
      expiresAt: new Date(Date.now() + env.tokenTtlMs.passwordReset),
    },
  });

  await sendPasswordResetEmail(user.email, raw);
}

export async function resetPassword(rawToken, newPassword) {
  const tokenHash = hashToken(rawToken);
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!record || record.used || record.expiresAt < new Date()) {
    throw new ApiError(400, 'Reset link is invalid or has expired');
  }

  const hashed = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { password: hashed },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { used: true },
    }),
    // Force re-login everywhere after a password reset.
    prisma.refreshToken.updateMany({
      where: { userId: record.userId },
      data: { revoked: true },
    }),
  ]);
}

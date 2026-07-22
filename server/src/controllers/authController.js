import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';
import * as authService from '../services/authService.js';

const REFRESH_COOKIE = 'refreshToken';

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.isProd ? 'none' : 'lax',
  path: '/api/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const registerController = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  res.status(201).json({
    success: true,
    message: 'Registration successful. Please check your email to verify your account.',
    data: { user },
  });
});

export const verifyEmailController = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.params.token);
  res.status(200).json({ success: true, message: 'Email verified successfully' });
});

export const loginController = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { user, accessToken },
  });
});

export const refreshController = asyncHandler(async (req, res) => {
  const rawRefreshToken = req.cookies?.[REFRESH_COOKIE];
  const { user, accessToken, refreshToken } = await authService.refresh(rawRefreshToken);
  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
  res.status(200).json({
    success: true,
    message: 'Token refreshed',
    data: { user, accessToken },
  });
});

export const logoutController = asyncHandler(async (req, res) => {
  const rawRefreshToken = req.cookies?.[REFRESH_COOKIE];
  await authService.logout(rawRefreshToken);
  res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const forgotPasswordController = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  res.status(200).json({
    success: true,
    message: 'If an account exists for this email, a reset link has been sent.',
  });
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.params.token, req.body.password);
  res.status(200).json({ success: true, message: 'Password reset successfully' });
});

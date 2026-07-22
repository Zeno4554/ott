import { Router } from 'express';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { validate } from '../middlewares/validate.js';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/authValidators.js';
import {
  registerController,
  verifyEmailController,
  loginController,
  refreshController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), registerController);
router.get('/verify-email/:token', validate(verifyEmailSchema), verifyEmailController);
router.post('/login', authLimiter, validate(loginSchema), loginController);
router.post('/refresh', refreshController);
router.post('/logout', logoutController);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPasswordController);
router.post('/reset-password/:token', authLimiter, validate(resetPasswordSchema), resetPasswordController);

export default router;

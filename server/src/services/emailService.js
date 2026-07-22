import { env } from '../config/env.js';

/**
 * Sprint 1 stub: no real email provider is wired up yet.
 * The function signatures match what a real provider (Resend/SendGrid/
 * Nodemailer+SMTP) will need, so swapping the implementation later requires
 * no changes to callers in authService.js.
 */

function logEmail({ to, subject, link }) {
  console.log('\n--- [EMAIL STUB] ---');
  console.log(`From: ${env.emailFrom}`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Link: ${link}`);
  console.log('---------------------\n');
}

export async function sendVerificationEmail(to, rawToken) {
  const link = `${env.clientUrl}/verify-email/${rawToken}`;
  logEmail({ to, subject: 'Verify your email', link });
}

export async function sendPasswordResetEmail(to, rawToken) {
  const link = `${env.clientUrl}/reset-password/${rawToken}`;
  logEmail({ to, subject: 'Reset your password', link });
}

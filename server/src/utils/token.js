import crypto from 'crypto';

// Opaque, single-use tokens (verification / password reset) are generated
// randomly, sent to the user raw, and only the SHA-256 hash is persisted —
// so a database leak never exposes a usable token.
export function generateOpaqueToken() {
  const raw = crypto.randomBytes(32).toString('hex');
  const hash = hashToken(raw);
  return { raw, hash };
}

export function hashToken(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

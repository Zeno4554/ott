process.env.JWT_ACCESS_SECRET ||= 'test_access_secret';
process.env.JWT_REFRESH_SECRET ||= 'test_refresh_secret';
process.env.DATABASE_URL ||= 'postgresql://test:test@localhost:5432/test';

// Dynamic import: static `import` statements are hoisted above these
// process.env assignments in ESM, which would make env.js throw before the
// test env vars are set.
const { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } = await import('../jwt.js');

describe('jwt utils', () => {
  it('signs and verifies an access token with the expected payload', () => {
    const token = signAccessToken({ sub: 'user-1', role: 'USER' });
    const decoded = verifyAccessToken(token);
    expect(decoded.sub).toBe('user-1');
    expect(decoded.role).toBe('USER');
  });

  it('signs and verifies a refresh token', () => {
    const token = signRefreshToken({ sub: 'user-1' });
    const decoded = verifyRefreshToken(token);
    expect(decoded.sub).toBe('user-1');
  });

  it('rejects an access token verified with the refresh verifier', () => {
    const token = signAccessToken({ sub: 'user-1', role: 'USER' });
    expect(() => verifyRefreshToken(token)).toThrow();
  });

  it('rejects a tampered token', () => {
    const token = signAccessToken({ sub: 'user-1', role: 'USER' });
    const tampered = token.slice(0, -2) + 'xx';
    expect(() => verifyAccessToken(tampered)).toThrow();
  });
});

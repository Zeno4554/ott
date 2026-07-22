import { hashPassword, comparePassword } from '../password.js';

describe('password utils', () => {
  it('hashes a password to a different string than the original', async () => {
    const hash = await hashPassword('Sup3rSecret!');
    expect(hash).not.toBe('Sup3rSecret!');
    expect(hash.length).toBeGreaterThan(20);
  });

  it('verifies a correct password against its hash', async () => {
    const hash = await hashPassword('Sup3rSecret!');
    await expect(comparePassword('Sup3rSecret!', hash)).resolves.toBe(true);
  });

  it('rejects an incorrect password', async () => {
    const hash = await hashPassword('Sup3rSecret!');
    await expect(comparePassword('WrongPassword1', hash)).resolves.toBe(false);
  });
});

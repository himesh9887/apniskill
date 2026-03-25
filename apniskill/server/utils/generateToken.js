import { randomBytes } from 'node:crypto';

export function generateToken() {
  return `token_${randomBytes(24).toString('hex')}`;
}

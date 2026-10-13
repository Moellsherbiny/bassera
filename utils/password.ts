import { hash, compare } from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * Hash a plain-text password.
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

/**
 * Verify a plain-text password against a hashed password.
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return compare(password, hashedPassword);
}

import { randomInt } from "crypto";
import { hashPassword, verifyPassword } from "@/utils/password";

export function generateOtp(): string {
  return randomInt(100000, 1000000).toString();
}

export async function hashOtp(otp: string): Promise<string> {
  return hashPassword(otp);
}

export async function verifyOtp(
  otp: string,
  hashedOtp: string,
): Promise<boolean> {
  return verifyPassword(otp, hashedOtp);
}
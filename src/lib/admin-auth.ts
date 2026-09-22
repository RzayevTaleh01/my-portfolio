import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "cv_admin";
const MAX_AGE = 60 * 60 * 8;

function adminCode() {
  return process.env.ADMIN_CODE?.trim() ?? "";
}

export function isAdminConfigured() {
  return adminCode().length > 0;
}

function sameText(a: string, b: string) {
  const hash = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(hash(a), hash(b));
}

function sessionToken() {
  return createHmac("sha256", adminCode()).update("cv-admin-session-v1").digest("hex");
}

export function isCorrectCode(code: string) {
  return isAdminConfigured() && sameText(code.trim(), adminCode());
}

export async function isAdmin() {
  if (!isAdminConfigured()) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  return Boolean(value) && sameText(value!, sessionToken());
}

export async function startSession() {
  (await cookies()).set(COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

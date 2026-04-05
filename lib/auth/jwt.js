import { SignJWT, jwtVerify } from "jose";

const AUTH_COOKIE = "auth_token";
const PW_RESET_COOKIE = "pw_reset";

function getSecret() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 16) {
    throw new Error("JWT_SECRET must be set and at least 16 characters");
  }
  return new TextEncoder().encode(s);
}

export { AUTH_COOKIE, PW_RESET_COOKIE };

export async function signAuthToken(payload) {
  const role = payload.role === "admin" ? "admin" : "user";
  return new SignJWT({ typ: "auth", email: payload.email, role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(payload.userId))
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyAuthToken(token) {
  const { payload } = await jwtVerify(token, getSecret());
  if (payload.typ !== "auth") throw new Error("Invalid token type");
  const role = payload.role === "admin" ? "admin" : "user";
  return { userId: payload.sub, email: payload.email, role };
}

export async function signPasswordResetToken(userId) {
  return new SignJWT({ typ: "pwd_reset" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(getSecret());
}

export async function verifyPasswordResetCookie(token) {
  const { payload } = await jwtVerify(token, getSecret());
  if (payload.typ !== "pwd_reset") throw new Error("Invalid token type");
  return { userId: payload.sub };
}

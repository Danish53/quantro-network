import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth/jwt";

export async function getAuthUserIdFromRequest(request) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!token) {
    return null;
  }

  try {
    const payload = await verifyAuthToken(token);
    return payload.userId ?? null;
  } catch {
    return null;
  }
}

/** Normalize DB/JWT role to `user` | `admin` (case-insensitive; legacy docs may omit `role`). */
export function normalizeUserRole(role) {
  if (role === undefined || role === null) return "user";
  const r = String(role).trim().toLowerCase();
  return r === "admin" ? "admin" : "user";
}

/**
 * Role used for login redirect, admin gate, and /api/auth/me.
 * Order: DB role (normalized) → ADMIN_LOGIN_EMAILS env → dev fallback for seeded admin without role field.
 */
export function effectiveUserRole(user) {
  const email = (user?.email || "").toLowerCase().trim();
  const fromDb = normalizeUserRole(user?.role);
  if (fromDb === "admin") return "admin";

  const allow = process.env.ADMIN_LOGIN_EMAILS;
  if (allow?.trim()) {
    const set = new Set(allow.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean));
    if (email && set.has(email)) return "admin";
  }

  if (
    process.env.NODE_ENV === "development" &&
    email === "admin@gmail.com" &&
    (user?.role === undefined || user?.role === null || String(user.role).trim() === "")
  ) {
    return "admin";
  }

  return fromDb;
}

/** Portal destination for an authenticated session (navbar / hero / marketing CTAs). */
export function portalPathForSessionUser(user) {
  return effectiveUserRole(user) === "admin" ? "/dashboard/admin" : "/dashboard";
}

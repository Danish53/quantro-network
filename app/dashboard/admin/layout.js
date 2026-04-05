import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth/jwt";
import { effectiveUserRole } from "@/lib/auth/roles";

export const metadata = {
  title: "Admin | Quantro Network",
  description: "Quantro Network administration",
};

export default async function AdminSegmentLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) {
    redirect("/login?from=admin");
  }

  let payload;
  try {
    payload = await verifyAuthToken(token);
  } catch {
    redirect("/login?expired=1&from=admin");
  }

  try {
    await connectDB();
  } catch {
    redirect("/dashboard");
  }

  const user = await User.findById(payload.userId).lean();
  if (!user || user.deletedAt || effectiveUserRole(user) !== "admin") {
    redirect("/dashboard");
  }

  return children;
}

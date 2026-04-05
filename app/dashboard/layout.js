import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardLayoutBridge from "../components/dashboard/DashboardLayoutBridge";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth/jwt";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/models/User";

export const metadata = {
  title: "Dashboard | Quantro Network",
  description: "Quantro Network member dashboard",
};

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) {
    redirect("/login?from=dashboard");
  }
  let payload;
  try {
    payload = await verifyAuthToken(token);
  } catch {
    redirect("/login?expired=1&from=dashboard");
  }
  try {
    await connectDB();
    const user = await User.findById(payload.userId).lean();
    if (!user || user.deletedAt) {
      redirect("/login?from=dashboard");
    }
  } catch {
    redirect("/login?from=dashboard");
  }
  return <DashboardLayoutBridge>{children}</DashboardLayoutBridge>;
}

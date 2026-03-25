import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardShell from "../components/dashboard/DashboardShell";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth/jwt";

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
  try {
    await verifyAuthToken(token);
  } catch {
    redirect("/login?expired=1&from=dashboard");
  }
  return <DashboardShell>{children}</DashboardShell>;
}

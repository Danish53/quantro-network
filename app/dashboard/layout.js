import DashboardShell from "../components/dashboard/DashboardShell";

export const metadata = {
  title: "Dashboard | Quantro Network",
  description: "Quantro Network member dashboard",
};

export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}

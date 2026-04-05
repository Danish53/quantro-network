import { redirect } from "next/navigation";

/** Legacy URL — settings live under `/dashboard/admin/settings`. */
export default function AdminProfileRedirectPage() {
  redirect("/dashboard/admin/settings");
}

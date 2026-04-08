import { redirect } from "next/navigation";

/** Default QN Virtual Card entry — same as Generate. */
export default function VirtualCardPage() {
  redirect("/dashboard/virtual-card/generate");
}

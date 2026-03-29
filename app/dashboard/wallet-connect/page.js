import { redirect } from "next/navigation";

/** Legacy URL: wallet connection is modal + Crypto Wallets page only. */
export default function WalletConnectPage() {
  redirect("/dashboard/wallets?openWallet=1");
}

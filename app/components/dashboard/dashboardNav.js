/** Sidebar navigation — hrefs match app/dashboard/* stub routes. */
export const dashboardNavSections = [
  {
    id: "home",
    label: "Home",
    items: [
      { label: "Subscriber Portal", href: "/dashboard", icon: "portal" },
      { label: "Fund", href: "/dashboard/fund", icon: "fund" },
      { label: "EA Vault", href: "/dashboard/ea-vault", icon: "vault", hasChevron: true },
      { label: "Withdrawal", href: "/dashboard/withdrawal", icon: "withdraw", hasChevron: true },
      { label: "Transactions", href: "/dashboard/transactions", icon: "transactions" },
      { label: "EAs Real Time/Live Trades", href: "/dashboard/live-trades", icon: "chart" },
      { label: "Partnership Program", href: "/dashboard/partnership", icon: "chip", hasChevron: true },
    ],
  },
  {
    id: "personal",
    label: "Personal",
    items: [
      { label: "Profile", href: "/dashboard/profile", icon: "profile" },
      { label: "2FA Authentication", href: "/dashboard/2fa", icon: "lock2fa" },
      { label: "KYC Verification", href: "/dashboard/kyc", icon: "kyc" },
    ],
  },
];

/** Sidebar navigation — hrefs match app/dashboard/* stub routes. */
export const dashboardNavSections = [
  {
    id: "home",
    labelKey: "dash.section_home",
    items: [
      { labelKey: "dash.nav_portal", href: "/dashboard", icon: "portal" },
      { labelKey: "dash.nav_virtual_card", href: "/dashboard/virtual-card", icon: "vcard" },
      { labelKey: "dash.nav_wallets", href: "/dashboard/wallets", icon: "wallets" },
      { labelKey: "dash.nav_convert", href: "/dashboard/convert", icon: "convert" },
      { labelKey: "dash.nav_fund", href: "/dashboard/fund", icon: "fund" },
      { labelKey: "dash.nav_withdrawal", href: "/dashboard/withdrawal", icon: "withdraw", hasChevron: true },
      { labelKey: "dash.nav_membership_plans", href: "/dashboard/membership-plans", icon: "membership" },
      // { labelKey: "dash.nav_vault", href: "/dashboard/ea-vault", icon: "vault", hasChevron: true },
      { labelKey: "dash.nav_transactions", href: "/dashboard/transactions", icon: "transactions" },
      // { labelKey: "dash.nav_live_trades", href: "/dashboard/live-trades", icon: "chart" },
      // { labelKey: "dash.nav_partnership", href: "/dashboard/partnership", icon: "chip", hasChevron: true },
      // { labelKey: "dash.nav_signals_api", href: "/dashboard/signals-api", icon: "signals" },
    ],
  },
  {
    id: "personal",
    labelKey: "dash.section_personal",
    items: [
      { labelKey: "dash.nav_profile", href: "/dashboard/profile", icon: "profile" },
      { labelKey: "dash.nav_2fa", href: "/dashboard/2fa", icon: "lock2fa" },
      { labelKey: "dash.nav_kyc", href: "/dashboard/kyc", icon: "kyc" },
      { labelKey: "dash.nav_reset_password", href: "/dashboard/reset-password", icon: "resetpw" },
    ],
  },
];

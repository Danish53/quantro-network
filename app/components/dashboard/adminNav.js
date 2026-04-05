/** Single item pinned at bottom of admin sidebar (above logout / exit). */


/** Admin sidebar — `/dashboard/admin/*`. */
export const adminNavSections = [
  {
    id: "main",
    labelKey: "admin.section_main",
    items: [
      { labelKey: "admin.nav_overview", href: "/dashboard/admin", icon: "portal" },
      { labelKey: "admin.nav_users", href: "/dashboard/admin/users", icon: "profile" },
      { labelKey: "admin.nav_deposits", href: "/dashboard/admin/deposits", icon: "fund" },
      { labelKey: "admin.nav_withdrawals", href: "/dashboard/admin/withdrawals", icon: "withdraw" },
    ],
  },
  {
    id: "platform",
    labelKey: "admin.section_platform",
    items: [
      { labelKey: "admin.nav_virtual_cards", href: "/dashboard/admin/virtual-cards", icon: "chip" },
      { labelKey: "admin.nav_crypto_wallets", href: "/dashboard/admin/crypto-wallets", icon: "wallets" },
      { labelKey: "admin.nav_kyc", href: "/dashboard/admin/kyc", icon: "kyc" },
    ],
  },
  {
    id: "settings",
    labelKey: "admin.nav_settings",
    items: [
      { labelKey: "admin.nav_settings", href: "/dashboard/admin/settings", icon: "settings" },
    ],
  },
];

/** Shared Web3 wallet UI — icons, helpers, BSC token list for on-chain reads. */

export const BSC_TOKENS = [
  { symbol: "USDT", decimals: 18, address: "0x55d398326f99059fF775485246999027B3197955" },
  { symbol: "USDC", decimals: 18, address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d" },
];

export function shortenAddress(address) {
  if (!address) return "—";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function connectorIcon(name = "") {
  const lower = name.toLowerCase();
  if (lower.includes("meta")) return <MetaMaskIcon />;
  if (lower.includes("walletconnect")) return <WalletConnectIcon />;
  if (lower.includes("coinbase")) return <CoinbaseIcon />;
  return <GenericWalletIcon />;
}

export function GenericWalletIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="6" width="18" height="12" rx="4" fill="#334155" />
      <rect x="14" y="10" width="6" height="4" rx="2" fill="#93C5FD" />
    </svg>
  );
}

export function MetaMaskIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 3l5.3 3.9L8.4 5 4 3z" fill="#E17726" />
      <path d="M20 3l-5.2 4L15.5 5 20 3z" fill="#E27625" />
      <path d="M6 14.4l1.3 2.2-2.8.8.8-3z" fill="#E27625" />
      <path d="M18 14.4l-.7 3-2.8-.8 1.3-2.2z" fill="#E27625" />
      <path d="M16.9 9.2L16 13l3 .1-.1-2L16.9 9.2z" fill="#E27625" />
      <path d="M5.1 11.1l-.1 2L8 13l-.9-3.8-2 1.9z" fill="#E27625" />
      <path d="M8 13l.7 3.4h1.5v-2.3L8 13z" fill="#E27625" />
      <path d="M14 13l-2.2 1.1v2.3h1.5L14 13z" fill="#E27625" />
      <path d="M13.3 18.4H10.7l.3-2h2l.3 2z" fill="#F5841F" />
      <path d="M11.9 8.8l-.2.7-4.5-.2 1.2-1.9 3.5 1.4z" fill="#E27625" />
      <path d="M12.1 8.8l3.5-1.4 1.2 1.9-4.5.2-.2-.7z" fill="#E27625" />
      <path d="M7.2 9.3l1.9 4.6-.6-.9-3-.1.5-3.6 1.2 0z" fill="#F5841F" />
      <path d="M16.8 9.3l1.2 0 .5 3.6-3 .1-.6.9 1.9-4.6z" fill="#F5841F" />
      <path d="M8.9 13.9l1.2 2.4-2.7-.8 1.5-1.6z" fill="#C0AD9E" />
      <path d="M15.1 13.9l1.5 1.6-2.7.8 1.2-2.4z" fill="#C0AD9E" />
      <path d="M10.1 12.1l-.1 2.2-1-.4 1.1-1.8z" fill="#161616" />
      <path d="M13.9 12.1l1.1 1.8-1 .4-.1-2.2z" fill="#161616" />
      <path d="M10.1 16.3l.6-.1h2.6l.6.1-.3 2h-3.2l-.3-2z" fill="#161616" />
    </svg>
  );
}

export function WalletConnectIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect width="24" height="24" rx="12" fill="#3B99FC" />
      <path
        d="M7.5 9.8c2.5-2.4 6.5-2.4 9 0l.3.3a.4.4 0 010 .6l-1 1a.4.4 0 01-.6 0l-.6-.6a3.8 3.8 0 00-5.2 0l-.7.6a.4.4 0 01-.6 0l-1-1a.4.4 0 010-.6l.4-.3z"
        fill="#fff"
      />
      <path
        d="M18.4 11.8l.9.9a.4.4 0 010 .6l-4.2 4.2a.4.4 0 01-.6 0l-3-3a.2.2 0 00-.3 0l-3 3a.4.4 0 01-.6 0L3.4 13.3a.4.4 0 010-.6l.9-.9a.4.4 0 01.6 0l3 3a.2.2 0 00.3 0l3-3a.4.4 0 01.6 0l3 3a.2.2 0 00.3 0l3-3a.4.4 0 01.6 0z"
        fill="#fff"
      />
    </svg>
  );
}

export function CoinbaseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect width="24" height="24" rx="12" fill="#0052FF" />
      <circle cx="12" cy="12" r="5" fill="#fff" />
      <circle cx="12" cy="12" r="2.3" fill="#0052FF" />
    </svg>
  );
}

export function TokenBadge({ symbol }) {
  if (symbol === "USDT") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="12" fill="#26A17B" />
        <path
          d="M6 7.5h12v2H13v1.1c2.7.1 4.8.8 4.8 1.6s-2.1 1.5-4.8 1.6v3.7h-2v-3.7c-2.7-.1-4.8-.8-4.8-1.6s2.1-1.5 4.8-1.6V9.5H6v-2zm5 4.1c-2.2.1-3.7.6-3.7 1s1.5.9 3.7 1V11.6zm2 .1v1.9c2.2-.1 3.7-.6 3.7-1s-1.5-.9-3.7-.9z"
          fill="#fff"
        />
      </svg>
    );
  }
  if (symbol === "USDC") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="12" fill="#2775CA" />
        <circle cx="12" cy="12" r="6.8" fill="none" stroke="#fff" strokeWidth="1.6" />
        <path
          d="M12.9 8.5h-1.8a2 2 0 000 4h1.8a2 2 0 010 4h-1.8M12 7.2v1.3m0 7v1.3"
          stroke="#fff"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return <span className="text-[10px] font-bold text-white">{symbol}</span>;
}

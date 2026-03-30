import { createConfig, http } from "wagmi";
import { bsc, mainnet } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

/**
 * Browser extensions: Wagmi adds them via EIP-6963 (`multiInjectedProviderDiscovery`) — one row per
 * wallet with correct `name` / `icon` / `id` (rdns). No static `injected()` list (that duplicated MIPD
 * before and `WeakSet` dedupe hid real wallets).
 */
const connectors = [];
if (projectId) {
  connectors.push(
    walletConnect({
      projectId,
      metadata: {
        name: "Quantro Network",
        description: "Quantro dashboard wallet connection",
        url: "https://quantronetwork.com",
        icons: ["https://quantronetwork.com/favicon.ico"],
      },
      showQrModal: true,
    }),
  );
}

export const wagmiConfig = createConfig({
  /** Ethereum first (wallet UI); BSC kept for on-chain fund / treasury flows. */
  chains: [mainnet, bsc],
  connectors,
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
  },
  multiInjectedProviderDiscovery: true,
});

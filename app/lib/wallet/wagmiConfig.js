import { createConfig, http } from "wagmi";
import { bsc } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const connectors = [injected({ shimDisconnect: true })];

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
  chains: [bsc],
  connectors,
  transports: {
    [bsc.id]: http(),
  },
});

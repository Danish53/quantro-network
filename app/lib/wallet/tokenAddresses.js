import { bsc } from "wagmi/chains";

export const BSC_USDT = "0x55d398326f99059fF775485246999027B3197955";
export const BSC_USDC = "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d";

export const TOKEN_META = {
  USDT_BNB: { address: BSC_USDT, chainId: bsc.id, decimals: 18 },
  USDC_BNB: { address: BSC_USDC, chainId: bsc.id, decimals: 18 },
};

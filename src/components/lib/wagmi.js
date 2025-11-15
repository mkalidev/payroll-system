import { createClient } from "viem";
import { http, createConfig } from "wagmi";
import { baseSepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [baseSepolia],
  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
});

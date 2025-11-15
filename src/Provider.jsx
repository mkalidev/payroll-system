import { createAppKit } from "@reown/appkit/react";

import { WagmiProvider } from "wagmi";
import {
  base,
  baseSepolia,
  celo,
  optimism,
  arbitrum,
} from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId from https://dashboard.reown.com
const projectId = "76b54c9641d8cacc5e7fa973a9e5c8f1";

// 2. Create a metadata object - optional
const metadata = {
  name: "Gloc - Payroll",
  description:
    "Streamline your crypto payroll with Glöc. Manage employees, process payments, and handle payroll with ease using blockchain technology.",
  url: "https://gloc.pro", // origin must match your domain & subdomain
  icons: ["https://gloc.pro/gloc-logo.svg"],
};

// 3. Set the networks
const networks = [baseSepolia, base, optimism, celo, arbitrum];

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  defaultNetwork: baseSepolia, // Set Base Sepolia as default network
  projectId,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

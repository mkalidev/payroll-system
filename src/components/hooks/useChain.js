import { useChainId, useSwitchChain } from "wagmi";
import { chains, getChainName, isBaseChain } from "../lib/wagmi";

export const useChain = () => {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  // Add safety checks for undefined chainId
  const currentChainName = chainId ? getChainName(chainId) : "Unknown Chain";
  const isBaseNetwork = chainId ? isBaseChain(chainId) : false;

  const switchToBaseMainnet = () => {
    if (chains?.baseMainnet?.id) {
      switchChain({ chainId: chains.baseMainnet.id });
    }
  };

  const switchToBaseTestnet = () => {
    if (chains?.baseSepoliaTestnet?.id) {
      switchChain({ chainId: chains.baseSepoliaTestnet.id });
    }
  };

  const isMainnet = chainId === chains?.baseMainnet?.id;
  const isTestnet = chainId === chains?.baseSepoliaTestnet?.id;

  return {
    chainId: chainId || null,
    currentChainName,
    isBaseNetwork,
    isMainnet: Boolean(isMainnet),
    isTestnet: Boolean(isTestnet),
    switchToBaseMainnet,
    switchToBaseTestnet,
    isPending,
    chains: {
      mainnet: chains?.baseMainnet || null,
      testnet: chains?.baseSepoliaTestnet || null,
    },
  };
};

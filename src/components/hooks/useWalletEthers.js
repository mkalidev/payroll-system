import { useState, useEffect } from "react";
import { ethers } from "ethers";

export function useWalletEthers() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Initialize provider
  useEffect(() => {
    const initProvider = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        // Listen for account changes
        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);

        // Check if already connected
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          await connectWallet();
        }
      } else {
        setError("MetaMask not found. Please install MetaMask.");
      }
    };

    initProvider();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      // User disconnected
      setAddress(null);
      setSigner(null);
      setIsConnected(false);
    } else {
      // User switched accounts
      await connectWallet();
    }
  };

  const handleChainChanged = async (chainId) => {
    // Reload the page when chain changes
    window.location.reload();
  };

  const connectWallet = async () => {
    if (!provider) {
      setError("Provider not initialized");
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      // Request account access
      await provider.send("eth_requestAccounts", []);

      // Get signer and address
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // Get network
      const network = await provider.getNetwork();

      setSigner(signer);
      setAddress(address);
      setChainId(network.chainId);
      setIsConnected(true);

      console.log("Wallet connected with Ethers:");
      console.log("Address:", address);
      console.log("Chain ID:", network.chainId);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError(error.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setSigner(null);
    setChainId(null);
    setIsConnected(false);
    console.log("Wallet disconnected");
  };

  const switchNetwork = async (targetChainId) => {
    if (!provider) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (error) {
      console.error("Error switching network:", error);
      setError("Failed to switch network. Please switch manually in MetaMask.");
    }
  };

  return {
    // Connection state
    provider,
    signer,
    address,
    chainId,
    isConnected,
    isConnecting,
    error,

    // Functions
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };
}

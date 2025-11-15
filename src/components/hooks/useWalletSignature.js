import { useState, useEffect } from "react";
import { useSignMessage } from "wagmi";
import toast from "react-hot-toast";

export const useWalletSignature = (address, isConnected) => {
  const [hasRequestedSignature, setHasRequestedSignature] = useState(false);
  const [signature, setSignature] = useState(null);
  const [message, setMessage] = useState("");

  const { signMessageAsync, isPending, isSuccess, isError, error } =
    useSignMessage();

  // Generate signature message
  const generateMessage = (walletAddress) => {
    const timestamp = new Date().toISOString();
    const nonce = Math.random().toString(36).substring(2, 15);

    return `Welcome to Gloc Payroll!

Please sign this message to authenticate with your wallet.

Address: ${walletAddress}
Timestamp: ${timestamp}
Nonce: ${nonce}

This signature proves you own this wallet and allows you to access the payroll system.`;
  };

  // Store signature in localStorage
  const storeSignature = (walletAddress, sig, msg) => {
    const signatureData = {
      address: walletAddress,
      signature: sig,
      message: msg,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };

    localStorage.setItem(
      `signature_${walletAddress.toLowerCase()}`,
      JSON.stringify(signatureData)
    );
  };

  // Get stored signature
  const getStoredSignature = (walletAddress) => {
    const stored = localStorage.getItem(
      `signature_${walletAddress.toLowerCase()}`
    );
    if (!stored) return null;

    try {
      const data = JSON.parse(stored);
      // Check if signature has expired
      if (new Date(data.expiresAt) < new Date()) {
        localStorage.removeItem(`signature_${walletAddress.toLowerCase()}`);
        return null;
      }
      return data;
    } catch (error) {
      console.error("Error parsing signature data:", error);
      return null;
    }
  };

  // Request signature from user
  const requestSignature = async () => {
    if (!address || !isConnected) {
      toast.error("Wallet not connected");
      return;
    }

    try {
      // Generate message
      const signatureMessage = generateMessage(address);
      setMessage(signatureMessage);

      // Show loading toast
      const loadingToast = toast.loading(
        "Please sign the message in your wallet..."
      );

      // Request signature
      const sig = await signMessageAsync({
        message: signatureMessage,
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (sig) {
        setSignature(sig);
        storeSignature(address, sig, signatureMessage);
        toast.success("Message signed successfully!");
        return sig;
      }
    } catch (err) {
      console.error("Signature request failed:", err);

      // Handle user rejection
      if (
        err.message?.includes("User rejected") ||
        err.message?.includes("denied")
      ) {
        toast.error("Signature request rejected");
      } else {
        toast.error("Failed to sign message");
      }

      throw err;
    }
  };

  // Auto-request signature when wallet connects
  useEffect(() => {
    const handleSignature = async () => {
      if (address && isConnected && !hasRequestedSignature) {
        // Check if we already have a valid signature
        const existingSignature = getStoredSignature(address);

        if (existingSignature) {
          // Use existing signature
          setSignature(existingSignature.signature);
          setMessage(existingSignature.message);
          setHasRequestedSignature(true);
          toast.success("Welcome back! Using existing signature.");
        } else {
          // Request new signature
          setHasRequestedSignature(true);
          try {
            await requestSignature();
          } catch (error) {
            // Error already handled in requestSignature
            console.error("Auto-signature failed:", error);
          }
        }
      }
    };

    handleSignature();
  }, [address, isConnected, hasRequestedSignature]);

  // Reset when wallet disconnects
  useEffect(() => {
    if (!isConnected || !address) {
      setHasRequestedSignature(false);
      setSignature(null);
      setMessage("");
    }
  }, [isConnected, address]);

  // Clear signature
  const clearSignature = () => {
    if (address) {
      localStorage.removeItem(`signature_${address.toLowerCase()}`);
    }
    setSignature(null);
    setMessage("");
    setHasRequestedSignature(false);
  };

  return {
    // State
    signature,
    message,
    isSigning: isPending,
    isSuccess,
    isError,
    error,
    hasSignature: !!signature,

    // Actions
    requestSignature,
    clearSignature,
  };
};

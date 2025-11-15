import { useState } from "react";
import {
  useSendTransaction,
  useReadContract,
  useActiveAccount,
} from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import { contractAddress } from "../constants/contractABI.js";
import { client } from "../../client.js";
import { baseSepolia } from "thirdweb/chains";
import toast from "react-hot-toast";

export function useUSDCApprovalThirdweb() {
  const activeAccount = useActiveAccount();

  // USDC contract address on Base Sepolia
  const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

  // Get USDC contract instance
  const usdcContract = getContract({
    address: USDC_ADDRESS,
    chain: baseSepolia,
    client: client,
  });

  // Send transaction hook
  const { mutate: sendTransaction, isLoading: isApproving } =
    useSendTransaction();

  // USDC contract read functions
  const { data: currentAllowance, isLoading: isLoadingAllowance } =
    useReadContract({
      contract: usdcContract,
      method:
        "function allowance(address owner, address spender) view returns (uint256)",
      params: [activeAccount?.address, contractAddress],
    });

  const { data: usdcBalance, isLoading: isLoadingBalance } = useReadContract({
    contract: usdcContract,
    method: "function balanceOf(address account) view returns (uint256)",
    params: [activeAccount?.address],
  });

  // Transaction states
  const [isApprovalConfirming, setIsApprovalConfirming] = useState(false);
  const [isApprovalSuccess, setIsApprovalSuccess] = useState(false);
  const [approvalTxHash, setApprovalTxHash] = useState(null);
  const [error, setError] = useState(null);

  // Approve USDC spending
  const approveUSDCSpending = async (amount) => {
    if (!activeAccount?.address) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      setError(null);
      setIsApprovalConfirming(true);
      // Prepare contract call
      const transaction = prepareContractCall({
        contract: usdcContract,
        method:
          "function approve(address spender, uint256 amount) returns (bool)",
        params: [contractAddress, amount],
      });

      // Send transaction
      sendTransaction(transaction, {
        onSuccess: (result) => {
          setApprovalTxHash(result.transactionHash);
          setIsApprovalConfirming(true);
          toast.success("USDC approval successful");
          console.log("USDC approval successful:", result);

          setIsApprovalConfirming(false);
          setIsApprovalSuccess(true);

          // Reset success after 5 seconds
          setTimeout(() => setIsApprovalSuccess(false), 5000);
        },
        onError: (error) => {
          console.error("Failed to approve USDC spending:", error);
          setIsApprovalConfirming(false);
          setError(error.message || "Approval failed");
          toast.error(error?.message);
        },
      });
    } catch (error) {
      console.error("Error preparing approval transaction:", error);
      setError(error.message || "Failed to prepare approval transaction");
      toast.error(error?.message);
    }
  };

  // Check if approval is needed
  const needsApproval = (requiredAmount) => {
    if (!currentAllowance || !requiredAmount) return false;
    return currentAllowance < requiredAmount;
  };

  // Refresh allowance and balance (Thirdweb handles this automatically)
  const refreshData = async () => {
    // Thirdweb automatically refetches data when needed
    console.log("Data refresh requested - Thirdweb handles this automatically");
  };

  return {
    // USDC data
    currentAllowance,
    usdcBalance,

    // Loading states
    isLoadingAllowance,
    isLoadingBalance,

    // Transaction states
    isApproving,
    isApprovalConfirming,
    isApprovalSuccess,
    approvalTxHash,
    error,

    // Functions
    approveUSDCSpending,
    needsApproval,
    refreshData,
  };
}

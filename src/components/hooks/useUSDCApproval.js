import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { contractAddress } from "../constants/contractABI.js";
import { USDC_ABI } from "../constants/USDCAbi.js";

export function useUSDCApproval() {
  const { address } = useAccount();

  // Read current allowance
  const { data: currentAllowance, isLoading: allowanceLoading } =
    useReadContract({
      address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC address on Base Sepolia
      abi: USDC_ABI,
      functionName: "allowance",
      args: [address, contractAddress],
      query: {
        enabled: !!address,
      },
    });

  // Read USDC balance
  const { data: usdcBalance, isLoading: balanceLoading } = useReadContract({
    address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC address on Base Sepolia
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: !!address,
    },
  });

  // Write contract for approval
  const {
    writeContract: approveUSDC,
    data: approvalHash,
    isPending: isApproving,
  } = useWriteContract();

  // Wait for approval transaction
  const { isLoading: isApprovalConfirming, isSuccess: isApprovalSuccess } =
    useWaitForTransactionReceipt({
      hash: approvalHash,
    });

  // Approve USDC spending
  const approveUSDCSpending = (amount) => {
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    console.log("Approving USDC spending...");
    console.log("Amount to approve:", amount.toString());
    console.log("Contract address:", contractAddress);
    console.log("User address:", address);

    approveUSDC({
      address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC address on Base Sepolia
      abi: USDC_ABI,
      functionName: "approve",
      args: [contractAddress, amount],
    });
  };

  // Check if approval is needed
  const needsApproval = (requiredAmount) => {
    if (!currentAllowance || !requiredAmount) return false;
    return currentAllowance < requiredAmount;
  };

  return {
    // Read data
    currentAllowance,
    usdcBalance,

    // Loading states
    allowanceLoading,
    balanceLoading,
    isApproving,
    isApprovalConfirming,
    isApprovalSuccess,

    // Functions
    approveUSDCSpending,
    needsApproval,

    // Transaction data
    approvalHash,
  };
}

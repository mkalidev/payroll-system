// src/lib/usePayrollContract.ts
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { contractAddress, contractABI } from "../constants/contractABI.js";

export function usePayrollContract() {
  const chainId = useChainId();

  // Log chain information for debugging
  console.log("=== CONTRACT DEBUG INFO ===");
  console.log("Current Chain ID:", chainId);
  console.log("Expected Chain ID: 84532 (Base Sepolia)");
  console.log("Contract Address:", contractAddress);
  console.log("Is on correct network:", chainId === 84532);
  console.log("==========================");

  // Read contract functions
  const { data: usdcAddress, isLoading: usdcLoading } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "USDC",
  });

  const { data: usdtAddress, isLoading: usdtLoading } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "USDT",
  });

  const { data: owner, isLoading: ownerLoading } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "owner",
  });

  const { data: isPaused, isLoading: pausedLoading } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "paused",
  });

  // Write contract functions
  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Contract interaction functions
  const distributePayrollUSDC = (payments, taxAmount) => {
    // Validate chain - Base Sepolia has chain ID 84532
    if (chainId !== 84532) {
      console.error(
        "Wrong chain! Expected Base Sepolia (84532), got:",
        chainId
      );
      alert("Please switch to Base Sepolia network");
      return;
    }

    // Format payments array to match contract structure
    const formattedPayments = payments.map((payment) => [
      payment.recipient,
      payment.amount,
    ]);

    console.log(formattedPayments);

    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "distributePayrollUSDC",
      args: [formattedPayments, taxAmount],
    });

    console.log("done");
  };

  const distributePayrollUSDT = (payments, taxAmount) => {
    // Validate chain - Base Sepolia has chain ID 84532
    if (chainId !== 84532) {
      console.error(
        "Wrong chain! Expected Base Sepolia (84532), got:",
        chainId
      );
      alert("Please switch to Base Sepolia network");
      return;
    }

    // Format payments array to match contract structure
    const formattedPayments = payments.map((payment) => [
      payment.recipient,
      payment.amount,
    ]);

    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "distributePayrollUSDT",
      args: [formattedPayments, taxAmount],
    });
  };

  const pause = () => {
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "pause",
    });
  };

  const unpause = () => {
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "unpause",
    });
  };

  const withdrawTax = (tokenAddress) => {
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "withdrawTax",
      args: [tokenAddress],
    });
  };

  const transferOwnership = (newOwner) => {
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "transferOwnership",
      args: [newOwner],
    });
  };

  return {
    // Read data
    usdcAddress,
    usdtAddress,
    owner,
    isPaused,

    // Loading states
    usdcLoading,
    usdtLoading,
    ownerLoading,
    pausedLoading,
    isPending,
    isConfirming,
    isSuccess,

    // Write functions
    distributePayrollUSDC,
    distributePayrollUSDT,
    pause,
    unpause,
    withdrawTax,
    transferOwnership,

    // Transaction data
    hash,
  };
}

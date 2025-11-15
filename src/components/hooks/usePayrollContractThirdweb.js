import { useState } from "react";
import {
  useSendTransaction,
  useReadContract,
  useActiveAccount,
} from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import { contractAddress } from "../constants/contractABI.js";
import { baseSepolia } from "thirdweb/chains";
import { client } from "../../client.js";
import toast from "react-hot-toast";
import { useCreatePayroll } from "./usePayroll.js";

export function usePayrollContractThirdweb(payrollData = {}) {
  const { createPayrollFn } = useCreatePayroll();
  const activeAccount = useActiveAccount();

  // Get contract instance
  const contract = getContract({
    address: contractAddress,
    chain: baseSepolia,
    client: client,
  });

  // Send transaction hook
  const { mutate: sendTransaction, isLoading: isSending } =
    useSendTransaction();

  // Contract read functions
  const { data: usdcAddress, isLoading: isLoadingUSDC } = useReadContract({
    contract,
    method: "function USDC() view returns (address)",
  });

  const { data: usdtAddress, isLoading: isLoadingUSDT } = useReadContract({
    contract,
    method: "function USDT() view returns (address)",
  });

  const { data: owner, isLoading: isLoadingOwner } = useReadContract({
    contract,
    method: "function owner() view returns (address)",
  });

  const { data: isPaused, isLoading: isLoadingPaused } = useReadContract({
    contract,
    method: "function paused() view returns (bool)",
  });

  // Transaction states
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);

  // Contract interaction functions
  const distributePayrollUSDC = async (payments, taxAmount) => {
    if (!activeAccount?.address) {
      setError("Please connect your wallet first.");
      return;
    }

    try {
      setIsPending(true);
      setError(null);

      // Format payments array to match contract structure
      const formattedPayments = payments.map((payment) => [
        payment.recipient,
        payment.amount,
      ]);

      console.log("Distributing payroll with Thirdweb:");
      console.log("Formatted payments:", formattedPayments);
      // console.log("Tax amount:", taxAmount);

      // Prepare contract call
      const transaction = prepareContractCall({
        contract,
        method: "function distributePayrollUSDC((address,uint256)[] ,uint256)",
        params: [formattedPayments, taxAmount],
      });

      // Send transaction
      sendTransaction(transaction, {
        onSuccess: async (result) => {
          setTxHash(result.transactionHash);
          setIsPending(false);
          setIsConfirming(true);

          console.log("Transaction successful:", {
            hash: result.transactionHash,
          });
          toast.success("Payroll Distribution successful ");

          // Create payroll record in the database
          try {
            const payrollBody = {
              title: payrollData.title,
              category: payrollData.category,
              chain: payrollData.chain,
              currency: payrollData.currency,
              totalSalary: payrollData.totalAmount,
              tax: payrollData.totalTax,
              tx: result.transactionHash,
              workspaceId: payrollData.workspaceId,
              employeeCount: payrollData.selectedEmployees?.length || 0,
            };

            await createPayrollFn(payrollBody);
            console.log("Payroll record created successfully");
            toast.success("Payroll record created successfully");
          } catch (error) {
            console.error("Error creating payroll record:", error);
            toast.error(
              "Transaction successful but failed to save payroll record"
            );
          }

          setIsConfirming(false);
          setIsSuccess(true);

          // Reset success after 5 seconds
          setTimeout(() => setIsSuccess(false), 5000);
        },
        onError: (error) => {
          console.error("Error distributing payroll:", error);
          setIsPending(false);
          setIsConfirming(false);
          setError(error.message || "Failed to distribute payroll");
        },
      });
    } catch (error) {
      console.error("Error preparing transaction:", error);
      setIsPending(false);
      setError(error.message || "Failed to prepare transaction");
    }
  };

  const distributePayrollUSDT = async (payments, taxAmount) => {
    if (!activeAccount?.address) {
      setError("Please connect your wallet first.");
      return;
    }

    try {
      setIsPending(true);
      setError(null);

      const formattedPayments = payments.map((payment) => [
        payment.recipient,
        payment.amount,
      ]);

      // Prepare contract call
      const transaction = prepareContractCall({
        contract,
        method: "function distributePayrollUSDT((address,uint256)[] ,uint256)",
        params: [formattedPayments, taxAmount],
      });

      // Send transaction
      sendTransaction(transaction, {
        onSuccess: async (result) => {
          setTxHash(result.transactionHash);
          setIsPending(false);
          setIsConfirming(true);

          console.log("USDT payroll transaction successful:", {
            hash: result.transactionHash,
          });

          // Create payroll record in the database
          try {
            const payrollBody = {
              title: payrollData.title,
              category: payrollData.category,
              chain: payrollData.chain,
              currency: payrollData.currency,
              totalAmount: payrollData.totalAmount,
              transactionHash: result.transactionHash,
              workspaceId: payrollData.workspaceId,
              employees:
                payrollData.selectedEmployees?.map((emp) => ({
                  id: emp.id,
                  address: emp.address,
                  name: emp.name,
                  salary: emp.salary,
                })) || [],
            };

            await createPayrollFn(payrollBody);
            console.log("Payroll record created successfully");
          } catch (error) {
            console.error("Error creating payroll record:", error);
            toast.error(
              "Transaction successful but failed to save payroll record"
            );
          }

          setIsConfirming(false);
          setIsSuccess(true);

          setTimeout(() => setIsSuccess(false), 5000);
        },
        onError: (error) => {
          console.error("Error distributing USDT payroll:", error);
          setIsPending(false);
          setIsConfirming(false);
          setError(error.message || "Transaction failed");
        },
      });
    } catch (error) {
      console.error("Error preparing transaction:", error);
      setIsPending(false);
      setError(error.message || "Failed to prepare transaction");
    }
  };

  const pause = async () => {
    try {
      setIsPending(true);

      const transaction = prepareContractCall({
        contract,
        method: "function pause()",
        params: [],
      });

      sendTransaction(transaction, {
        onSuccess: () => {
          setIsPending(false);
        },
        onError: (error) => {
          console.error("Error pausing contract:", error);
          setIsPending(false);
          setError(error.message);
        },
      });
    } catch (error) {
      console.error("Error preparing pause transaction:", error);
      setIsPending(false);
      setError(error.message);
    }
  };

  const unpause = async () => {
    try {
      setIsPending(true);

      const transaction = prepareContractCall({
        contract,
        method: "function unpause()",
        params: [],
      });

      sendTransaction(transaction, {
        onSuccess: () => {
          setIsPending(false);
        },
        onError: (error) => {
          console.error("Error unpausing contract:", error);
          setIsPending(false);
          setError(error.message);
        },
      });
    } catch (error) {
      console.error("Error preparing unpause transaction:", error);
      setIsPending(false);
      setError(error.message);
    }
  };

  const withdrawTax = async (tokenAddress) => {
    try {
      setIsPending(true);

      const transaction = prepareContractCall({
        contract,
        method: "function withdrawTax(address tokenAddress)",
        params: [tokenAddress],
      });

      sendTransaction(transaction, {
        onSuccess: () => {
          setIsPending(false);
        },
        onError: (error) => {
          console.error("Error withdrawing tax:", error);
          setIsPending(false);
          setError(error.message);
        },
      });
    } catch (error) {
      console.error("Error preparing withdraw transaction:", error);
      setIsPending(false);
      setError(error.message);
    }
  };

  const transferOwnership = async (newOwner) => {
    try {
      setIsPending(true);

      const transaction = prepareContractCall({
        contract,
        method: "function transferOwnership(address newOwner)",
        params: [newOwner],
      });

      sendTransaction(transaction, {
        onSuccess: () => {
          setIsPending(false);
        },
        onError: (error) => {
          console.error("Error transferring ownership:", error);
          setIsPending(false);
          setError(error.message);
        },
      });
    } catch (error) {
      console.error("Error preparing transfer ownership transaction:", error);
      setIsPending(false);
      setError(error.message);
    }
  };

  // Validation function to check if contract is properly initialized
  const validateContract = async () => {
    if (!activeAccount?.address) {
      console.error("No active account");
      return false;
    }

    try {
      // Test if we can access contract data
      if (owner) {
        console.log("Contract validation successful, owner:", owner);
        return true;
      } else {
        console.error("Contract validation failed: owner data not available");
        return false;
      }
    } catch (error) {
      console.error("Contract validation failed:", error);
      return false;
    }
  };

  return {
    // Contract data
    usdcAddress,
    usdtAddress,
    owner,
    isPaused,

    // Loading states
    isLoadingUSDC,
    isLoadingUSDT,
    isLoadingOwner,
    isLoadingPaused,

    // Transaction states
    isPending: isPending || isSending,
    isConfirming,
    isSuccess,
    txHash,
    error,

    // Functions
    distributePayrollUSDC,
    distributePayrollUSDT,
    pause,
    unpause,
    withdrawTax,
    transferOwnership,
    validateContract,
  };
}

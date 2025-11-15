import React from "react";
import {
  ConnectButton,
  darkTheme,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";
import { client } from "../../client";
import { baseSepolia } from "thirdweb/chains";
import { usePayrollContractThirdweb } from "../hooks/usePayrollContractThirdweb";
import { useUSDCApprovalThirdweb } from "../hooks/useUSDCApprovalThirdweb";
import { createPaymentArray, convertTaxToUSDC, truncate } from "../lib/utils";
import toast from "react-hot-toast";
import Spinner from "./Spinner";

export default function ConnectButtonThirdweb({
  selectedEmployees = [],
  totalTax = 0,
  title = "",
  category = "",
  chain = "base",
  currency = "USDC",
  totalAmount = 0,
  workspaceId = null,
  isFormValid = false,
}) {
  // Thirdweb wallet connection
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;
  const { disconnect } = useDisconnect();
  const wallet = useActiveWallet();

  // Smart contract interactions (Thirdweb)
  const {
    usdcAddress,
    usdtAddress,
    owner,
    isPaused,
    isPending,
    isConfirming,
    isSuccess,
    txHash,
    error: contractError,
    pause,
    unpause,
    withdrawTax,
    distributePayrollUSDC,
    isLoadingUSDC,
    isLoadingUSDT,
    isLoadingOwner,
    isLoadingPaused,
    validateContract,
  } = usePayrollContractThirdweb({
    title,
    category,
    chain,
    totalTax,
    currency,
    totalAmount,
    workspaceId,
    selectedEmployees,
  });

  // USDC approval functionality (Thirdweb)
  const {
    currentAllowance,
    usdcBalance,
    isApproving,
    isApprovalConfirming,
    isApprovalSuccess,
    approveUSDCSpending,
    needsApproval,
    error: approvalError,
    isLoadingAllowance,
    isLoadingBalance,
  } = useUSDCApprovalThirdweb();

  // Create payment array and convert tax for smart contract
  const handleDistributePayroll = async () => {
    if (selectedEmployees.length === 0) {
      alert("Please select employees first");
      return;
    }

    try {
      // Create payment array with only address and salary (converted to USDC)
      const paymentArray = createPaymentArray(selectedEmployees);

      // Convert tax to USDC BigNumber
      const taxAmountUSDC = convertTaxToUSDC(totalTax);

      // Calculate total amount needed (salaries + tax)
      const totalSalaryUSDC = paymentArray.reduce(
        (sum, payment) => sum + payment.amount,
        0n
      );
      const totalAmountNeeded = totalSalaryUSDC + taxAmountUSDC;

      // Check if approval is needed
      if (needsApproval(totalAmountNeeded)) {
        console.log(
          "Approval needed. Current allowance:",
          currentAllowance?.toString()
        );
        console.log("Required amount:", totalAmountNeeded.toString());
        await approveUSDCSpending(totalAmountNeeded);
        return;
      }

      // Check if user has enough USDC balance
      if (usdcBalance && usdcBalance < totalAmountNeeded) {
        toast.error(
          `Insufficient USDC balance. You have $${(
            Number(usdcBalance.toString()) / 1e6
          ).toFixed(2)}, but need $${(
            Number(totalAmountNeeded.toString()) / 1e6
          ).toFixed(2)}.`
        );
        return;
      }
      // Call the smart contract function
      await distributePayrollUSDC(paymentArray, taxAmountUSDC);
    } catch (error) {
      console.error("Error distributing payroll:", error);
      // alert("Error distributing payroll. Please try again.");
      toast.error(`${error}`);
    }
  };

  const paymentArray = createPaymentArray(selectedEmployees);
  const totalSalaryUSDC = paymentArray.reduce(
    (sum, payment) => sum + payment.amount,
    0n
  );
  const totalAmountNeeded = totalSalaryUSDC + convertTaxToUSDC(totalTax);

  if (address) {
    return (
      <div className="space-y-4">
        {/* Connection Status */}
        <div className="flex gap-3 px-3 py-1.5 bg-gray-100 rounded-lg items-center justify-between">
          <p className="w-full">{truncate(address, 16)}</p>
          <button
            onClick={() => disconnect(wallet)}
            className="w-fit px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
          >
            Disconnect
          </button>
        </div>
        <div className="flex justify-between w-full items-center gap-4">
          <p>Your USDC Balance</p>
          <p>
            $
            {usdcBalance
              ? (Number(usdcBalance.toString()) / 1e6).toFixed(2)
              : "0.00"}
          </p>
        </div>

        {/* Contract Information */}
        <div className="space-y-2">
          {/* Debug Information */}
          {/* <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Debug Info:</h4>
            <div className="text-xs space-y-1">
              <p>
                <strong>Contract Status:</strong>{" "}
                {isLoadingUSDC ||
                isLoadingUSDT ||
                isLoadingOwner ||
                isLoadingPaused
                  ? "⏳ Loading..."
                  : "✅ Ready"}
              </p>
              <p>
                <strong>USDC Data:</strong>{" "}
                {isLoadingAllowance || isLoadingBalance
                  ? "⏳ Loading..."
                  : "✅ Loaded"}
              </p>
              <p>
                <strong>Owner:</strong>{" "}
                {owner
                  ? `${owner.slice(0, 6)}...${owner.slice(-4)}`
                  : "Loading..."}
              </p>
              <p>
                <strong>Chain:</strong> Base Sepolia (84532)
              </p>
            </div>
            <button
              onClick={async () => {
                const isValid = await validateContract();
                console.log("Contract validation result:", isValid);
                alert(`Contract validation: ${isValid ? "SUCCESS" : "FAILED"}`);
              }}
              className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              Test Contract
            </button>
          </div> */}

          {/* Payroll Distribution */}
          {selectedEmployees.length > 0 && isFormValid && (
            <div className="space-y-2">
              {isApprovalSuccess ? (
                <button
                  className="w-full flex-1 py-4 px-6 bg-c-color text-white cursor-pointer rounded-lg text-sm font-medium hover:bg-c-bg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  onClick={handleDistributePayroll}
                  disabled={isPending || isConfirming || isPaused}
                >
                  {isPending || isConfirming ? (
                    <Spinner />
                  ) : (
                    "Distribute Payroll"
                  )}
                </button>
              ) : (
                <button
                  onClick={async () => {
                    const paymentArray = createPaymentArray(selectedEmployees);
                    const totalSalaryUSDC = paymentArray.reduce(
                      (sum, payment) => sum + payment.amount,
                      0n
                    );
                    const totalAmountNeeded =
                      totalSalaryUSDC + convertTaxToUSDC(totalTax);
                    await approveUSDCSpending(totalAmountNeeded);
                  }}
                  disabled={
                    isApproving ||
                    isApprovalConfirming ||
                    isPending ||
                    isConfirming
                  }
                  className="w-full px-4 py-4 bg-c-bg text-white cursor-pointer rounded-lg text-sm font-medium hover:bg-gray-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isApproving || isApprovalConfirming ? (
                    <Spinner />
                  ) : (
                    "Approve USDC"
                  )}
                </button>
              )}
            </div>
          )}

          {/* Show message when form is not valid */}
          {(!isFormValid || selectedEmployees.length === 0) && (
            <div className="text-sm text-gray-500 text-center py-2">
              {!isFormValid &&
                "Please fill in all required fields and select employees"}
              {isFormValid &&
                selectedEmployees.length === 0 &&
                "Please select at least one employee"}
            </div>
          )}

          {/* Contract Actions (only for owner) */}
          {/* <div className="">
            {owner &&
              address &&
              owner.toLowerCase() === address.toLowerCase() && (
                <div className="space-y-2 pt-2">
                  <h4 className="font-medium">Owner Actions</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={isPaused ? unpause : pause}
                      disabled={isPending || isConfirming}
                      className={`px-3 py-1 rounded text-sm ${
                        isPaused
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      } disabled:opacity-50`}
                    >
                      {isPending || isConfirming
                        ? "Processing..."
                        : isPaused
                        ? "Unpause"
                        : "Pause"}
                    </button>

                    {usdcAddress && (
                      <button
                        onClick={() => withdrawTax(usdcAddress)}
                        disabled={isPending || isConfirming}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm disabled:opacity-50"
                      >
                        Withdraw USDC Tax
                      </button>
                    )}

                    {usdtAddress && (
                      <button
                        onClick={() => withdrawTax(usdtAddress)}
                        disabled={isPending || isConfirming}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm disabled:opacity-50"
                      >
                        Withdraw USDT Tax
                      </button>
                    )}
                  </div>
                </div>
              )}


            {(isPending ||
              isConfirming ||
              isSuccess ||
              isApproving ||
              isApprovalConfirming ||
              isApprovalSuccess) && (
              <div className="mt-2 p-2 bg-gray-100 rounded">
                {isApproving && (
                  <p className="text-sm text-blue-600">
                    Approving USDC spending...
                  </p>
                )}
                {isApprovalConfirming && (
                  <p className="text-sm text-yellow-600">
                    Confirming USDC approval...
                  </p>
                )}
                {isApprovalSuccess && (
                  <p className="text-sm text-green-600">
                    USDC approval successful!
                  </p>
                )}
                {isPending && (
                  <p className="text-sm text-blue-600">
                    Transaction pending...
                  </p>
                )}
                {isConfirming && (
                  <p className="text-sm text-yellow-600">
                    Confirming transaction...
                  </p>
                )}
                {isSuccess && (
                  <p className="text-sm text-green-600">
                    Transaction successful!
                  </p>
                )}
                {txHash && (
                  <p className="text-xs text-gray-600">Tx Hash: {txHash}</p>
                )}
              </div>
            )}
          </div> */}
        </div>
      </div>
    );
  }

  return (
    <div className="!w-full">
      <ConnectButton
        client={client}
        chain={baseSepolia}
        connectButton={{
          label: "Connect Wallet",
        }}
        theme={darkTheme({
          colors: {
            primaryButtonBg: "#94C294",
            primaryButtonText: "white",
          },
        })}
      />
    </div>
  );
}

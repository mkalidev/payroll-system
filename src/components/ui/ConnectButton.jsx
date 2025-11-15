import React from "react";
import {
  AutoConnect,
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";
import { client } from "../../client";
import { baseSepolia } from "wagmi/chains";
import { usePayrollContract } from "../hooks/usePayrollContract";
import { useUSDCApproval } from "../hooks/useUSDCApproval";
import {
  createPaymentArray,
  convertTaxToUSDC,
  truncateAddress,
} from "../lib/utils";
import { useChainId, useSwitchChain } from "wagmi";

export default function ConnectButtons({
  selectedEmployees = [],
  totalTax = 0,
}) {
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;
  const { disconnect } = useDisconnect();
  const wallet = useActiveWallet();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  // Smart contract interactions
  const {
    usdcAddress,
    usdtAddress,
    owner,
    isPaused,
    isPending,
    isConfirming,
    isSuccess,
    pause,
    unpause,
    withdrawTax,
    distributePayrollUSDC,
  } = usePayrollContract();

  // USDC approval functionality
  const {
    currentAllowance,
    usdcBalance,
    allowanceLoading,
    balanceLoading,
    isApproving,
    isApprovalConfirming,
    isApprovalSuccess,
    approveUSDCSpending,
    needsApproval,
  } = useUSDCApproval();

  // Force switch to Base Sepolia
  const switchToBaseSepolia = async () => {
    try {
      console.log("Attempting to switch to Base Sepolia (84532)...");
      await switchChain({ chainId: 84532 });
      console.log("Successfully switched to Base Sepolia");
    } catch (error) {
      console.error("Failed to switch to Base Sepolia:", error);
      alert("Please manually switch to Base Sepolia network in your wallet");
    }
  };

  // Debug logging
  React.useEffect(() => {
    console.log("Current Chain ID:", chainId);
    console.log("Expected Chain ID: 84532 (Base Sepolia)");
    console.log("Wallet Address:", address);
    console.log("Is on correct network:", chainId === 84532);
  }, [chainId, address]);

  // Create payment array and convert tax for smart contract
  const handleDistributePayroll = () => {
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

      console.log("Selected Employees:", selectedEmployees);
      console.log("Payment Array:", paymentArray);
      console.log("Tax Amount (USDC):", taxAmountUSDC.toString());
      console.log("Total Amount Needed:", totalAmountNeeded.toString());
      console.log("Current Allowance:", currentAllowance?.toString() || "0");
      console.log("USDC Balance:", usdcBalance?.toString() || "0");

      // Check if approval is needed
      if (needsApproval(totalAmountNeeded)) {
        console.log(
          "Approval needed. Current allowance:",
          currentAllowance?.toString()
        );
        console.log("Required amount:", totalAmountNeeded.toString());
        approveUSDCSpending(totalAmountNeeded);
        return;
      }

      // Check if user has enough USDC balance
      if (usdcBalance && usdcBalance < totalAmountNeeded) {
        alert(
          `Insufficient USDC balance. You have ${usdcBalance.toString()} wei, but need ${totalAmountNeeded.toString()} wei.`
        );
        return;
      }

      // Format for contract (array of arrays)
      const formattedPayments = paymentArray.map((payment) => [
        payment.recipient,
        payment.amount,
      ]);
      console.log("Formatted for Contract:", formattedPayments);

      // Call the smart contract function
      distributePayrollUSDC(paymentArray, taxAmountUSDC);
    } catch (error) {
      console.error("Error distributing payroll:", error);
      alert("Error distributing payroll. Please try again.");
    }
  };

  if (address) {
    return (
      <div className="space-y-4 p-4 border rounded-lg">
        {/* Connection Status */}
        <div className="space-y-2">
          <p className="w-full px-5 py-3 rounded-xl bg-c-color text-white">
            Connected address: <br /> {truncateAddress(address)}
          </p>
          <button
            onClick={() => disconnect(wallet)}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Disconnect
          </button>
        </div>

        {/* Contract Information */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Smart Contract Info</h3>

          <div className="text-sm space-y-1">
            <p>
              <strong>Network:</strong>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs ${
                  chainId === 84532
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {chainId === 84532 ? "Base Sepolia" : `Chain ID: ${chainId}`}
              </span>
            </p>
            <p>
              <strong>Contract Owner:</strong>{" "}
              {owner
                ? `${owner.slice(0, 6)}...${owner.slice(-4)}`
                : "Loading..."}
            </p>
            <p>
              <strong>USDC Address:</strong>{" "}
              {usdcAddress
                ? `${usdcAddress.slice(0, 6)}...${usdcAddress.slice(-4)}`
                : "Loading..."}
            </p>
            <p>
              <strong>USDT Address:</strong>{" "}
              {usdtAddress
                ? `${usdtAddress.slice(0, 6)}...${usdtAddress.slice(-4)}`
                : "Loading..."}
            </p>
            <p>
              <strong>Contract Status:</strong>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs ${
                  isPaused
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {isPaused ? "Paused" : "Active"}
              </span>
            </p>
          </div>

          {/* Payroll Distribution */}
          {selectedEmployees.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="font-medium">Payroll Distribution</h4>

              {/* Network Warning */}
              {chainId !== 84532 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 mb-2">
                    ⚠️ Please switch to <strong>Base Sepolia</strong> network to
                    distribute payroll.
                  </p>
                  <button
                    onClick={switchToBaseSepolia}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Switch to Base Sepolia
                  </button>
                </div>
              )}

              <div className="text-sm space-y-1">
                <p>
                  <strong>Selected Employees:</strong>{" "}
                  {selectedEmployees.length}
                </p>
                <p>
                  <strong>Total Tax:</strong> ${totalTax.toLocaleString()}
                </p>
                <p>
                  <strong>Tax (USDC):</strong>{" "}
                  {convertTaxToUSDC(totalTax).toString()} wei
                </p>

                {/* USDC Balance and Allowance Info */}
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <h5 className="text-sm font-medium mb-2">USDC Status:</h5>
                  <div className="text-xs space-y-1">
                    <p>
                      <strong>Balance:</strong>{" "}
                      {balanceLoading
                        ? "Loading..."
                        : usdcBalance
                        ? `${usdcBalance.toString()} wei`
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Allowance:</strong>{" "}
                      {allowanceLoading
                        ? "Loading..."
                        : currentAllowance
                        ? `${currentAllowance.toString()} wei`
                        : "N/A"}
                    </p>
                    {selectedEmployees.length > 0 && (
                      <p>
                        <strong>Required:</strong>{" "}
                        {(() => {
                          const paymentArray =
                            createPaymentArray(selectedEmployees);
                          const totalSalaryUSDC = paymentArray.reduce(
                            (sum, payment) => sum + payment.amount,
                            0n
                          );
                          const totalAmountNeeded =
                            totalSalaryUSDC + convertTaxToUSDC(totalTax);
                          return `${totalAmountNeeded.toString()} wei`;
                        })()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  className="flex-1 py-4 px-6 bg-c-color text-white cursor-pointer rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  onClick={handleDistributePayroll}
                  disabled={
                    isPending ||
                    isConfirming ||
                    isPaused ||
                    isApproving ||
                    isApprovalConfirming
                  }
                >
                  {isApproving || isApprovalConfirming
                    ? "Approving..."
                    : isPending || isConfirming
                    ? "Processing..."
                    : "Distribute Payroll"}
                </button>

                {/* Manual Approval Button */}
                {selectedEmployees.length > 0 && (
                  <button
                    onClick={() => {
                      const paymentArray =
                        createPaymentArray(selectedEmployees);
                      const totalSalaryUSDC = paymentArray.reduce(
                        (sum, payment) => sum + payment.amount,
                        0n
                      );
                      const totalAmountNeeded =
                        totalSalaryUSDC + convertTaxToUSDC(totalTax);
                      approveUSDCSpending(totalAmountNeeded);
                    }}
                    disabled={
                      isApproving ||
                      isApprovalConfirming ||
                      isPending ||
                      isConfirming
                    }
                    className="px-4 py-4 bg-blue-600 text-white cursor-pointer rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Approve USDC
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Contract Actions (only for owner) */}
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

          {/* Transaction Status */}
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
                <p className="text-sm text-blue-600">Transaction pending...</p>
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
            </div>
          )}
        </div>
      </div>
    );
  }

  return <ConnectButton client={client} chain={baseSepolia} />;
}

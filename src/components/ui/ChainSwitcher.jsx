import React from "react";
import { useChain } from "../hooks/useChain";

export default function ChainSwitcher() {
  const {
    chainId,
    currentChainName,
    isMainnet,
    isTestnet,
    switchToBaseMainnet,
    switchToBaseTestnet,
    isPending,
  } = useChain();

  // Add safety check for when chainId is not available
  if (!chainId) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-sm font-medium text-gray-500">
              Connecting...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isMainnet ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
          <span className="text-sm font-medium text-gray-700">
            {currentChainName}
          </span>
        </div>
      </div>

      <div className="flex gap-1">
        <button
          onClick={switchToBaseTestnet}
          disabled={isTestnet || isPending}
          className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
            isTestnet
              ? "bg-blue-500 text-white cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {isPending ? "Switching..." : "Testnet"}
        </button>

        <button
          onClick={switchToBaseMainnet}
          disabled={isMainnet || isPending}
          className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
            isMainnet
              ? "bg-green-500 text-white cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {isPending ? "Switching..." : "Mainnet"}
        </button>
      </div>
    </div>
  );
}

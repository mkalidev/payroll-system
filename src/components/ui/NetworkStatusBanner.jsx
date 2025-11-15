import React from "react";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { WifiOff } from "lucide-react";

export default function NetworkStatusBanner() {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-[9999] flex items-center justify-center px-4 py-2 bg-red-100 text-red-800 border-b border-black/10 transition-all">
      <div className="flex items-center gap-2 text-sm font-medium">
        <WifiOff className="w-5 h-5" />
        <span>No internet connection. Some features may not work.</span>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection ||
    null;
  const [effectiveType, setEffectiveType] = useState(
    connection ? connection.effectiveType : "unknown"
  );
  const [downlink, setDownlink] = useState(
    connection ? connection.downlink : null
  );

  // Fallback: ping test
  const [pingMs, setPingMs] = useState(null);
  const [speedMbps, setSpeedMbps] = useState(null);
  const [pingPoor, setPingPoor] = useState(false);

  useEffect(() => {
    function updateOnlineStatus() {
      setIsOnline(navigator.onLine);
    }
    function updateConnectionStatus() {
      if (connection) {
        setEffectiveType(connection.effectiveType);
        setDownlink(connection.downlink);
      }
    }
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    if (connection) {
      connection.addEventListener("change", updateConnectionStatus);
    }
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      if (connection) {
        connection.removeEventListener("change", updateConnectionStatus);
      }
    };
    // eslint-disable-next-line
  }, [connection]);

  // Fallback: ping test if connection API is not available
  useEffect(() => {
    let interval;
    if (!connection) {
      const testPing = async () => {
        const start = Date.now();
        try {
          // Use a small static file (favicon) for ping
          await fetch("/favicon.ico?_=" + Math.random(), { cache: "no-store" });
          const latency = Date.now() - start;
          setPingMs(latency);
          setPingPoor(latency > 1200); // >1.2s is poor
        } catch {
          setPingMs(null);
          setPingPoor(true);
        }
      };
      testPing();
      interval = setInterval(testPing, 10000); // every 10s
    }
    return () => interval && clearInterval(interval);
  }, [connection]);

  // Optionally, estimate download speed (not used for poor connection, but can be shown)
  useEffect(() => {
    let cancelled = false;
    async function testSpeed() {
      if (!connection) {
        try {
          // Download a small file and estimate speed
          const start = Date.now();
          const response = await fetch("/favicon.ico?_=" + Math.random(), {
            cache: "no-store",
          });
          const blob = await response.blob();
          const end = Date.now();
          const sizeMB = blob.size / (1024 * 1024);
          const durationSec = (end - start) / 1000;
          const speed = sizeMB / durationSec;
          if (!cancelled) setSpeedMbps(speed);
        } catch {
          if (!cancelled) setSpeedMbps(null);
        }
      }
    }
    testSpeed();
    // Optionally, repeat every 30s
    const interval = setInterval(testSpeed, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [connection]);

  // Determine if connection is poor
  const isPoorConnection =
    isOnline &&
    ((connection &&
      (effectiveType === "2g" ||
        effectiveType === "slow-2g" ||
        (downlink && downlink < 0.5))) ||
      (!connection && pingPoor));

  return {
    isOnline,
    isPoorConnection,
    effectiveType: connection ? effectiveType : undefined,
    downlink: connection ? downlink : undefined,
    pingMs: !connection ? pingMs : undefined,
    speedMbps: !connection ? speedMbps : undefined,
  };
}

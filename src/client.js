// src/client.ts
import { createThirdwebClient } from "thirdweb";

export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_PUBLIC_THIRDWEB_CLIENT_ID || "f751a5613d09b119772bd8e1fb4b4cba",
});

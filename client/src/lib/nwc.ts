import { z } from "zod";

export interface WalletConnection {
  isConnected: boolean;
}

export const walletConnectionSchema = z.object({
  isConnected: z.boolean(),
});

// This file now serves as a type definition file only
// All wallet functionality is handled through the wallet-context.tsx
// which uses Bitcoin Connect's implementation
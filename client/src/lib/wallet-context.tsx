import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { walletService, type WalletConnection } from "./nwc";
import { useToast } from "@/hooks/use-toast";

interface WalletContextType {
  connection: WalletConnection | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  makePayment: (amount: number, recipient: string) => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connection, setConnection] = useState<WalletConnection | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      const conn = await walletService.connect();
      setConnection(conn);
      toast({
        title: "Wallet Connected",
        description: "Your NWC wallet has been connected successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Failed to connect your NWC wallet. Please try again.",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  const disconnect = useCallback(async () => {
    await walletService.disconnect();
    setConnection(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your NWC wallet has been disconnected.",
    });
  }, [toast]);

  const makePayment = useCallback(async (amount: number, recipient: string) => {
    try {
      const success = await walletService.makePayment(amount, recipient);
      if (success) {
        toast({
          title: "Payment Successful",
          description: `Successfully sent ${amount} sats!`,
        });
      }
      return success;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
      });
      return false;
    }
  }, [toast]);

  return (
    <WalletContext.Provider
      value={{
        connection,
        isConnecting,
        connect,
        disconnect,
        makePayment,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

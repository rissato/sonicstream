import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Button, init as initBitcoinConnect, requestProvider } from "@getalby/bitcoin-connect-react";
import { useToast } from "@/hooks/use-toast";

// Initialize Bitcoin Connect
initBitcoinConnect({
  appName: "Music Streaming Platform",
});

interface WalletContextType {
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  makePayment: (amount: number, recipient: string) => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      const provider = await requestProvider();
      if (provider) {
        setIsConnected(true);
        toast({
          title: "Wallet Connected",
          description: "Your wallet has been connected successfully.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Failed to connect your wallet. Please try again.",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  const disconnect = useCallback(async () => {
    // Bitcoin Connect handles disconnection internally
    setIsConnected(false);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  }, [toast]);

  const makePayment = useCallback(async (amount: number, recipient: string) => {
    try {
      const provider = await requestProvider();
      if (!provider) {
        throw new Error("No wallet connected");
      }

      // Convert amount to millisatoshis (sats * 1000)
      const invoice = await provider.makeInvoice({
        amount: amount * 1000,
        defaultMemo: "Music Streaming Subscription",
      });

      const { preimage } = await provider.sendPayment(invoice.paymentRequest);

      if (preimage) {
        toast({
          title: "Payment Successful",
          description: `Successfully sent ${amount} sats!`,
        });
        return true;
      }
      return false;
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
        isConnected,
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

// Export the Bitcoin Connect Button component for easy access
export { Button as WalletConnectButton };
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { init, requestProvider, WebLNProvider, onConnected, onDisconnected } from "@getalby/bitcoin-connect-react";
import { useToast } from "@/hooks/use-toast";

interface WalletContextType {
  provider: WebLNProvider | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  makePayment: (amount: number, recipient: string) => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<WebLNProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize Bitcoin Connect
    init({
      appName: "Music Streaming Platform",
    });

    // Set up connection listeners
    const unsubConnect = onConnected((provider) => {
      setProvider(provider);
      setIsConnecting(false);
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully.",
      });
    });

    const unsubDisconnect = onDisconnected(() => {
      setProvider(null);
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      });
    });

    return () => {
      unsubConnect();
      unsubDisconnect();
    };
  }, [toast]);

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      const weblnProvider = await requestProvider();
      setProvider(weblnProvider);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Failed to connect your wallet. Please try again.",
      });
      setIsConnecting(false);
    }
  }, [toast]);

  const disconnect = useCallback(async () => {
    if (provider) {
      // Bitcoin Connect handles the disconnection internally
      setProvider(null);
    }
  }, [provider]);

  const makePayment = useCallback(async (amount: number, recipient: string) => {
    if (!provider) return false;

    try {
      // Create an invoice using the recipient's lightning address
      const invoice = await provider.makeInvoice({
        amount,
        defaultMemo: `Payment to ${recipient}`,
      });

      // Send the payment
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
  }, [provider, toast]);

  return (
    <WalletContext.Provider
      value={{
        provider,
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
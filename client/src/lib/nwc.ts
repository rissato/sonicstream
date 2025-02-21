import { z } from "zod";
import { init, requestProvider, launchModal, launchPaymentModal, closeModal } from '@getalby/bitcoin-connect-react';

init({
  appName: "Sonic Stream",
  filters: ["nwc"],
});

export interface WalletConnection {
  walletPubkey: string;
  isConnected: boolean;
}

export const walletConnectionSchema = z.object({
  walletPubkey: z.string(),
  isConnected: z.boolean(),
});

class NWCWalletService {
  private connection: WalletConnection | null = null;
  private provider: any = null;

  async connect(): Promise<WalletConnection> {
    try {
      this.provider = await requestProvider();
      const info = await this.provider.getInfo();
      
      this.connection = {
        walletPubkey: info.publicKey,
        isConnected: true,
      };

      return this.connection;
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw new Error("Failed to connect wallet");
    }
  }

  async disconnect(): Promise<void> {
    this.connection = null;
    this.provider = null;
    closeModal();
  }

  async makePayment(amount: number, recipient: string): Promise<boolean> {
    if (!this.connection) {
      throw new Error("Wallet not connected");
    }

    try {
      // Launch payment modal with the invoice
      const { setPaid } = await launchPaymentModal({
        invoice: recipient, // Assuming recipient is a BOLT11 invoice
        onPaid: (response) => {
          console.log("Payment successful:", response.preimage);
          setPaid({ preimage: response.preimage });
          return true;
        },
        onCancelled: () => {
          throw new Error("Payment cancelled");
        }
      });

      return true;
    } catch (error) {
      console.error("Payment failed:", error);
      throw new Error("Payment failed");
    }
  }

  async showConnectModal(): Promise<void> {
    await launchModal();
  }

  getConnection(): WalletConnection | null {
    return this.connection;
  }
}

export const walletService = new NWCWalletService();
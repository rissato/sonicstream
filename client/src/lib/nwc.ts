import { z } from "zod";
import { init, requestProvider, launchModal, launchPaymentModal, closeModal } from '@getalby/bitcoin-connect-react';
import { LightningAddress } from "@getalby/lightning-tools";

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

  constructor() {
    init({
      appName: "Sonic Stream",
      filters: ["nwc"],
      showBalance: false,
      providerConfig: {
        nwc: {
          authorizationUrlOptions: {
            name: "Sonic Stream",
            requestMethods: ["make_invoice", "pay_invoice", "get_info"],
            budgetRenewal: "monthly",
            maxAmount: 1000,
            editable: true
          }
        }
      },
    });
  }

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

    const ln = new LightningAddress(recipient);
    await ln.fetch();
    const invoice = await ln.requestInvoice({ satoshi: amount });

    try {
      const { setPaid } = await launchPaymentModal({
        invoice: invoice.paymentRequest,
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

  async showConnectModal() {
    launchModal();
  }

  async connectWithModal(): Promise<WalletConnection> {
    this.showConnectModal();
    return this.connect();
  }

  getConnection(): WalletConnection | null {
    return this.connection;
  }
}

export const walletService = new NWCWalletService();
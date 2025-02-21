import { z } from "zod";
import { init, launchModal, launchPaymentModal, closeModal, onConnected } from '@getalby/bitcoin-connect-react';
import { LightningAddress } from "@getalby/lightning-tools";
import { bech32 } from "bech32";

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

    onConnected(async (provider) => {
      try {
        this.provider = provider;
        const info = await this.provider.getInfo();
        
        this.connection = {
          walletPubkey: info.publicKey,
          isConnected: true,
        };
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    });
  }

  async disconnect(): Promise<void> {
    this.connection = null;
    this.provider = null;
    closeModal();
  }

  async pay(amount: number, recipient: string): Promise<void> {
    if (!this.connection) {
      throw new Error("Wallet not connected");
    }

    console.log("Recipient", recipient);
    const ln = new LightningAddress(recipient);
    await ln.fetch();
    
    try {
      await this.provider.keysend({
        destination: ln.keysendData?.destination,
        amount,
        customRecords: {
          696969: this.encodeBech32("npub", recipient)
        },
      });
    } catch (error) {
      console.error("Payment failed:", error);
      throw new Error("Payment failed");
    }
  }

  encodeBech32(prefix: string, inputString: string): string {
    const encoder = new TextEncoder();
    const words = bech32.toWords(encoder.encode(inputString));
    return bech32.encode(prefix, words);
  }

  async payInvoice(amount: number, recipient: string): Promise<boolean> {
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

  async launchModal(): Promise<void> {
    await launchModal();
  }

  getConnection(): WalletConnection | null {
    return this.connection;
  }
}

export const walletService = new NWCWalletService();
import { useState } from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/lib/wallet-context";
import { Artist } from "@shared/schema";
import { PayButton } from "@getalby/bitcoin-connect-react";

interface ZapPaymentDialogProps {
  artist: Artist;
  onSuccess?: () => void;
}

export function ZapPaymentDialog({ artist, onSuccess }: ZapPaymentDialogProps) {
  const { provider, connect } = useWallet();
  const [amount, setAmount] = useState("1000");
  const [isOpen, setIsOpen] = useState(false);
  const [invoice, setInvoice] = useState<string | null>(null);

  const handleCreateInvoice = async () => {
    if (!provider) {
      await connect();
      return;
    }

    try {
      const inv = await provider.makeInvoice({
        amount: parseInt(amount),
        defaultMemo: `Support for ${artist.name}`,
      });
      setInvoice(inv.paymentRequest);
    } catch (error) {
      console.error("Failed to create invoice:", error);
    }
  };

  const handlePaymentSuccess = () => {
    onSuccess?.();
    setIsOpen(false);
    setInvoice(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Zap className="mr-2 h-4 w-4" />
          Send Zaps to Artist
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="bg-black/80" />
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Zaps to {artist.name}</DialogTitle>
            <DialogDescription>
              Support the artist by sending zaps directly to their wallet.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!provider ? (
              <p className="text-sm text-muted-foreground">
                Please connect your wallet first to send zaps.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  <label htmlFor="amount" className="text-sm font-medium">
                    Amount (sats)
                  </label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    placeholder="Enter amount in sats"
                  />
                </div>
                {invoice ? (
                  <PayButton
                    invoice={invoice}
                    onPaid={handlePaymentSuccess}
                  />
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleCreateInvoice}
                    disabled={!amount}
                  >
                    Create Payment Request
                  </Button>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
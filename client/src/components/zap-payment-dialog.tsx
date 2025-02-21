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

interface ZapPaymentDialogProps {
  artist: Artist;
  onSuccess?: () => void;
}

export function ZapPaymentDialog({ artist, onSuccess }: ZapPaymentDialogProps) {
  const { connection, makePayment } = useWallet();
  const [amount, setAmount] = useState("1000");
  const [isOpen, setIsOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const handlePayment = async () => {
    if (!connection) return;
    
    setIsPaying(true);
    try {
      const success = await makePayment(parseInt(amount), artist.walletAddress);
      if (success) {
        onSuccess?.();
        setIsOpen(false);
      }
    } finally {
      setIsPaying(false);
    }
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
            {!connection ? (
              <p className="text-sm text-muted-foreground">
                Please connect your NWC wallet first to send zaps.
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
                <Button
                  className="w-full"
                  onClick={handlePayment}
                  disabled={isPaying || !amount}
                >
                  {isPaying ? "Sending..." : "Send Zaps"}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

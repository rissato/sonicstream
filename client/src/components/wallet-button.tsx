import { useState } from "react";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWallet } from "@/lib/wallet-context";

export function WalletButton() {
  const { connection, isConnecting, connect, disconnect } = useWallet();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={connection ? "outline" : "default"}
          className="w-full"
          disabled={isConnecting}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {connection ? "Connected" : isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect your NWC Wallet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Connect your NWC wallet to support artists and access premium features.
          </p>
          <Button
            className="w-full"
            onClick={() => {
              if (connection) {
                disconnect();
              } else {
                connect();
              }
              setDialogOpen(false);
            }}
            disabled={isConnecting}
          >
            {connection ? "Disconnect" : isConnecting ? "Connecting..." : "Connect"} Wallet
          </Button>
          {connection && (
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm font-mono break-all">{connection.walletPubkey}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
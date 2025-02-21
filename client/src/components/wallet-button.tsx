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

export function WalletButton() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={isConnected ? "outline" : "default"}
          className="w-full"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isConnected ? "Connected" : "Connect Wallet"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect your NWC Wallet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Button
            className="w-full"
            onClick={() => setIsConnected(!isConnected)}
          >
            {isConnected ? "Disconnect" : "Connect"} Wallet
          </Button>
          {isConnected && (
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm font-mono">mock-wallet-address</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

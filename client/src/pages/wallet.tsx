import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import * as nwc from "@/lib/nwc";
import nwcLogo from "@/nwc-logo.svg"

export default function Wallet() {
  const [isConnected, setIsConnected] = useState(nwc.walletService.getConnection() !== null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsConnected(nwc.walletService.getConnection() !== null);
    }, 200);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <Alert className="bg-background">
          <AlertTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Value for value
          </AlertTitle>
          <AlertDescription className="mt-2 text-sm leading-relaxed">
            ⚡️ 21 sats per song, paid directly to artists.
          </AlertDescription>
        </Alert>

        <Alert 
          variant="destructive" 
          className="border-yellow-500 bg-yellow-50 text-yellow-800 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
        >
          <AlertDescription className="text-sm font-medium">
            This is experimental software. Please configure low budgets and be prepared for potential issues. Use at your own risk.
          </AlertDescription>
        </Alert>
      </div>

      <div>
        {isConnected ? (
          <Button
            onClick={() => nwc.walletService.disconnect()}
            className="font-medium bg-red-500 hover:bg-red-600 text-white"
          >
            Disconnect Wallet
          </Button>
        ) : (
          <Button
            onClick={() => nwc.walletService.launchModal()}
            className="font-medium flex items-center gap-2"
          >
            <img src={nwcLogo} alt="NWC Logo" className="w-5 h-5" />
            Connect Wallet
          </Button>
        )}
      </div>
    </div>
  );
}
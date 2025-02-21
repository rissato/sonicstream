import { Card, CardContent } from "@/components/ui/card";

import * as nwc from "@/lib/nwc";
import { Button } from "@/components/ui/button";

export default function Subscribe() {
  return (
    <div className="space-y-8">
      <section>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Subscription</h2>
            <Button
              onClick={() => nwc.walletService.showConnectModal()}
              className="w-full"
            >
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

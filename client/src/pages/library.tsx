import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Zap } from "lucide-react";

export default function Library() {
  // This will be replaced with actual user data once we implement authentication
  const isSubscribed = false;

  return (
    <div className="space-y-8">
      <section>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Your Library</h2>
            {!isSubscribed ? (
              <div className="text-center py-8">
                <h3 className="text-xl mb-4">Subscribe to Access Your Library</h3>
                <p className="text-muted-foreground mb-6">
                  Get unlimited access to all tracks and support your favorite artists
                </p>
                <Button className="w-full max-w-md">
                  <Zap className="mr-2 h-4 w-4" />
                  Subscribe with NWC Wallet
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No saved tracks yet
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/layout/layout";
import Discover from "@/pages/discover";
import Search from "@/pages/search";
import Library from "@/pages/library";
import Track from "@/pages/track";
import NotFound from "@/pages/not-found";
import Wallet from "@/pages/wallet";

function Router() {
  return (
    <Switch>
      <Route path="/discover" component={Discover} />
      <Route path="/search" component={Search} />
      <Route path="/library" component={Library} />
      <Route path="/track/:id" component={Track} />
      <Route path="/wallet" component={Wallet} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <Layout>
          <Router />
        </Layout>
        <Toaster />
    </QueryClientProvider>
  );
}

export default App;
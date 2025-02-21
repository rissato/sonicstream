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
import { RouteComponentProps } from "wouter";

function Router(props) {

  const setCurrentTrack = props.setCurrentTrack;
  
  return (
    <Switch>
      <Route path="/"
        component={(props: RouteComponentProps) => (
          <Discover {...props} setCurrentTrack={setCurrentTrack}/>
        )} 
      />
      <Route 
        path="/discover" 
        component={(props: RouteComponentProps) => (
          <Discover {...props} setCurrentTrack={setCurrentTrack}/>
        )} 
      />
      <Route 
        path="/track/:id" 
        component={(props: RouteComponentProps<{id: string}>) => (
          <Track {...props} setCurrentTrack={setCurrentTrack}/>
        )} 
      />
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
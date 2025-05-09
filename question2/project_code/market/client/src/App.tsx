import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "@/components/ui/Header";
import StockAnalysis from "@/pages/StockAnalysis";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

function Router() {
  return (
    <Switch>
      <Route path="/" component={StockAnalysis} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col h-screen">
          <Header />
          <main className="flex-grow overflow-auto">
            <Router />
          </main>
          <Toaster />
          <LoadingOverlay />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import NotFound from "@/pages/not-found";

// Components
import { Navigation } from "@/components/Navigation";

// Pages
import Home from "@/pages/Home";
import RouteList from "@/pages/RouteList";
import RouteDetail from "@/pages/RouteDetail";
import StopDetail from "@/pages/StopDetail";
import AccessibilityPage from "@/pages/Accessibility";

function Router() {
  return (
    <>
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/rutas" component={RouteList} />
        <Route path="/rutas/:slug" component={RouteDetail} />
        <Route path="/rutas/:slug/:stopId" component={StopDetail} />
        <Route path="/accesibilidad" component={AccessibilityPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AccessibilityProvider>
    </QueryClientProvider>
  );
}

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";

import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { initEmailJS } from "./config/emailjs.config";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initEmailJS(); // Initialize EmailJS when app starts
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
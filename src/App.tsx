import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Temperature from "./pages/Temperature";
import Alerts from "./pages/Alerts";
import Scheduler from "./pages/Scheduler";
import Progress from "./pages/Progress";
import DecisionGate from "./pages/DecisionGate";
import Devices from "./pages/Devices";
import Logs from "./pages/Logs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/temperature" element={<Temperature />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/scheduler" element={<Scheduler />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/decision-gate" element={<DecisionGate />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

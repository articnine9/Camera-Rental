import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/lib/stores/auth-store";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => {
  const { user } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route 
                path="/" 
                element={user?.role === 'admin' ? <Admin /> : <Navigate to="/login" />} 
              />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/admin" 
                element={user?.role === 'admin' ? <Admin /> : <Navigate to="/login" />} 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

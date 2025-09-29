import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthCallback from "./components/auth/AuthCallback";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import LogSymptoms from "./pages/LogSymptoms";
import History from "./pages/History";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { useAppSelector } from "./hooks/redux";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProfileDetails from "./pages/ProfileDetails";

const queryClient = new QueryClient();

const App = () => {
  const user = useAppSelector((state) => state.auth.user);
  
  console.log('[App] Redux user:', user);
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/log-symptoms" element={<ProtectedRoute><LogSymptoms /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfileDetails/></ProtectedRoute>}/>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;

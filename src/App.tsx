import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BurnProvider } from "@/context/BurnContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Activities from "./pages/Activities";
import LeaderboardPage from "./pages/LeaderboardPage";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BurnProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/dashboard" 
              element={
                <div className="min-h-screen bg-background">
                  <Navbar />
                  <Home />
                </div>
              } 
            />
            <Route 
              path="/activities" 
              element={
                <div className="min-h-screen bg-background">
                  <Navbar />
                  <Activities />
                </div>
              } 
            />
            <Route 
              path="/leaderboard" 
              element={
                <div className="min-h-screen bg-background">
                  <Navbar />
                  <LeaderboardPage />
                </div>
              } 
            />
            <Route 
              path="/history" 
              element={
                <div className="min-h-screen bg-background">
                  <Navbar />
                  <History />
                </div>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </BurnProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

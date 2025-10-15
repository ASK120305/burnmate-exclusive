import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BurnProvider } from "@/context/BurnContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import RequireAuth from "@/components/RequireAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Activities from "./pages/Activities";
import CalorieIntake from "./pages/CalorieIntake";
import LeaderboardPage from "./pages/LeaderboardPage";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";

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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route 
              path="/dashboard" 
              element={
                <RequireAuth>
                  <div className="min-h-screen bg-background">
                    <Navbar />
                    <Dashboard />
                  </div>
                </RequireAuth>
              } 
            />
            <Route 
              path="/activities" 
              element={
                <RequireAuth>
                  <div className="min-h-screen bg-background">
                    <Navbar />
                    <Activities />
                  </div>
                </RequireAuth>
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
              path="/calories" 
              element={
                <RequireAuth>
                  <div className="min-h-screen bg-background">
                    <Navbar />
                    <CalorieIntake />
                  </div>
                </RequireAuth>
              } 
            />
            <Route 
              path="/history" 
              element={
                <RequireAuth>
                  <div className="min-h-screen bg-background">
                    <Navbar />
                    <History />
                  </div>
                </RequireAuth>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <RequireAuth>
                  <div className="min-h-screen bg-background">
                    <Navbar />
                    <Profile />
                  </div>
                </RequireAuth>
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

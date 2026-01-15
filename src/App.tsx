import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateResume from "./pages/CreateResume";
import JobDescription from "./pages/JobDescription";
import Preview from "./pages/Preview";
import NotFound from "./pages/NotFound";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient();
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or loader
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-resume"
            element={
              <ProtectedRoute>
                <CreateResume />
              </ProtectedRoute>
            }
          />

          <Route
            path="/job-description"
            element={
              <ProtectedRoute>
                <JobDescription />
              </ProtectedRoute>
            }
          />

          <Route
            path="/preview"
            element={
              <ProtectedRoute>
                <Preview />
              </ProtectedRoute>
            }
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

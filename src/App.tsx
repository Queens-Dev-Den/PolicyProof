import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import DocumentAudit from "./pages/DocumentAudit";
import LiveAssistant from "./pages/LiveAssistant";
import Landing from "./pages/Landing";
import SignUpPage from "./pages/SignUpPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Import your Clerk Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

const App = () => (
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<Landing />} />
            
            {/* Auth Pages */}
            <Route path="/authentication" element={<SignUpPage />} />
            <Route path="/sign-in/*" element={<SignUpPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <>
                  <SignedIn>
                    <DashboardLayout>
                      <DocumentAudit />
                    </DashboardLayout>
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/" replace />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/assistant"
              element={
                <>
                  <SignedIn>
                    <DashboardLayout>
                      <LiveAssistant />
                    </DashboardLayout>
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/" replace />
                  </SignedOut>
                </>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;

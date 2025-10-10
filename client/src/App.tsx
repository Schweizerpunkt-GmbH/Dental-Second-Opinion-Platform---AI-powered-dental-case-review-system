import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import PatientDashboard from "@/pages/patient-dashboard";
import UploadWizard from "@/pages/upload-wizard";
import CaseDetail from "@/pages/case-detail";
import DentistDashboard from "@/pages/dentist-dashboard";
import DentistReview from "@/pages/dentist-review";
import AdminDashboard from "@/pages/admin-dashboard";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/:rest*" component={Landing} />
        </>
      ) : (
        <>
          {/* Role-based routing */}
          {user?.role === 'ADMIN' && (
            <>
              <Route path="/" component={AdminDashboard} />
              <Route path="/admin" component={AdminDashboard} />
            </>
          )}
          {user?.role === 'DENTIST' && (
            <>
              <Route path="/" component={DentistDashboard} />
              <Route path="/dentist" component={DentistDashboard} />
              <Route path="/review/:id" component={DentistReview} />
            </>
          )}
          {user?.role === 'PATIENT' && (
            <>
              <Route path="/" component={PatientDashboard} />
              <Route path="/dashboard" component={PatientDashboard} />
              <Route path="/upload" component={UploadWizard} />
              <Route path="/case/:id" component={CaseDetail} />
            </>
          )}
          {/* Fallback */}
          <Route component={NotFound} />
        </>
      )}
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

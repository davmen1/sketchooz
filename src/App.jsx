import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { LangProvider } from '@/lib/LangContext';
import { ThemeProvider } from '@/lib/ThemeProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
// Add page imports here
import LandingPage from './pages/LandingPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import SplashScreen from './components/SplashScreen';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';

// Only handles authenticated /app/* routes
const AuthenticatedApp = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      <Routes location={location}>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LangProvider>
          <QueryClientProvider client={queryClientInstance}>
            <Router>
              <Routes>
                {/* Public routes — no auth required */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                {/* Authenticated routes */}
                <Route path="/app/*" element={
                  <AuthProvider>
                    <AuthenticatedApp />
                  </AuthProvider>
                } />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Router>
            <Toaster />
          </QueryClientProvider>
        </LangProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App
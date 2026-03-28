import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
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

const AuthenticatedApp = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith('/app');

  // Show loading spinner while checking app public settings or auth


  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Allow public routes even when not logged in
      const publicPaths = ['/', '/privacy', '/terms'];
      const isPublic = publicPaths.includes(location.pathname);
      if (!isPublic) {
        navigateToLogin();
        return null;
      }
    }
  }

  // Render the main app
  return (
    <>
      {showSplash && isAppRoute && <SplashScreen onDone={() => setShowSplash(false)} />}
        <Routes location={location}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={null} />
          <Route path="pricing" element={null} />
          <Route path="settings" element={null} />
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
          <AuthProvider>
            <QueryClientProvider client={queryClientInstance}>
              <Router>
                <AuthenticatedApp />
              </Router>
              <Toaster />
            </QueryClientProvider>
          </AuthProvider>
        </LangProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { appParams } from '@/lib/app-params';
import { Capacitor } from '@capacitor/core';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      const savedToken = localStorage.getItem('b44_auth_token') || appParams.token;
      
      if (savedToken) {
        await checkUserAuth(savedToken);
      } else {
        setIsLoadingAuth(false);
      }
      setIsLoadingPublicSettings(false);
    } catch (error) {
      console.error('Errore inizializzazione:', error);
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async (token) => {
    try {
      setIsLoadingAuth(true);
      if (token) base44.auth.setToken(token);
      
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Check auth fallito:', error);
      localStorage.removeItem('b44_auth_token');
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const loginWithApple = async () => {
    try {
      console.log("🍎 Avvio modulo nativo Apple...");
      
      if (Capacitor.getPlatform() !== 'ios') {
        alert("Il login Apple è disponibile solo su iPhone reale o simulatore.");
        return;
      }

      const { SignInWithApple } = await import('@capacitor-community/apple-sign-in');
      const result = await SignInWithApple.authorize({
        clientId: 'sketchooz.base44.app',
        redirectURI: 'https://sketchooz.base44.app',
        scopes: 'email name',
      });

      if (result.response && result.response.identityToken) {
        const appleToken = result.response.identityToken;
        console.log("✅ Apple ID ottenuto. Scambio token con server Base44...");

        // FIX: campo corretto è identity_token (non token)
        const loginResponse = await base44.auth.loginWithProvider('apple', {
          identity_token: appleToken
        });

        if (loginResponse && loginResponse.token) {
          console.log("🎉 Token Base44 ricevuto correttamente!");
          localStorage.setItem('b44_auth_token', loginResponse.token);
          base44.auth.setToken(loginResponse.token);
          await checkUserAuth(loginResponse.token);
        } else {
          console.error("❌ Il server non ha restituito un token valido.", JSON.stringify(loginResponse));
        }
      }
    } catch (error) {
      console.error("❌ Errore durante il login Apple:", JSON.stringify(error));
      setAuthError(error.message || "Errore durante il login");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('b44_auth_token');
    base44.auth.setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  const navigateToLogin = () => {
    loginWithApple();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      logout,
      loginWithApple,
      navigateToLogin,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
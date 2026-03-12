import { useState, useEffect } from 'react'
import './App.css'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import { useAuth } from './contexts/AuthContext'

function App() {
  const { user, loading } = useAuth();

  // Handle Supabase email confirmation redirects
  useEffect(() => {
    // Check if URL has confirmation tokens
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get('type') === 'signup' || hashParams.get('type') === 'recovery') {
      // Clear the hash from URL after Supabase processes it
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <Auth />;
}

export default App
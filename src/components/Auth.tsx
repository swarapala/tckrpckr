import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) setError(error.message);
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) setError(error.message);
        else setError('Check your email to confirm your account!');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: 'https://tckrpckr.vercel.app/reset-password',
      });

      if (error) {
        setError(error.message);
      } else {
        setResetSent(true);
        setError('Check your email for password reset instructions!');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-black to-emerald-960 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-3">
            <span className="text-green-400">tckr</span>
            <span className="text-red-400">pckr</span>
          </h1>
          <p className="text-white/70 text-lg">AI-Powered Stock Analysis</p>
        </div>

        {/* Login Card */}
        <div className="bg-black rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                isLogin
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                !isLogin
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Sign Up
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-emerald-600/50 focus:ring-2 focus:ring-emerald-600/20 transition-all text-white placeholder:text-white/30"
                  placeholder="first and last name"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-emerald-600/50 focus:ring-2 focus:ring-emerald-600/20 transition-all text-white placeholder:text-white/30"
                placeholder="email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Password {!isLogin && <span className="text-white/40 text-xs">(min 6 characters)</span>}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-emerald-600/50 focus:ring-2 focus:ring-emerald-600/20 transition-all text-white placeholder:text-white/30"
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {!isLogin && password.length > 0 && password.length < 6 && (
                <p className="text-red-400 text-xs mt-1">Password must be at least 6 characters</p>
              )}
            </div>

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isLogin}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-emerald-600/50 focus:ring-2 focus:ring-emerald-600/20 transition-all text-white placeholder:text-white/30"
                  placeholder="••••••••"
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">Passwords don't match</p>
                )}
              </div>
            )}

            {error && (
              <div className={`text-sm p-3 rounded-lg ${
                error.includes('Check your email') 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 border border-white/20 hover:border-white/30"
            >
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Features */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Real-time data</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>AI insights</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Free forever</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-white/40">
          <p>© 2026 <span className="text-green-400">tckr</span><span className="text-red-400">pckr</span></p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Reset Password</h3>
            
            {!resetSent ? (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <p className="text-white/60 text-sm mb-4">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-emerald-600/50 focus:ring-2 focus:ring-emerald-600/20 transition-all text-white placeholder:text-white/30"
                    placeholder="you@example.com"
                  />
                </div>

                {error && (
                  <div className={`text-sm p-3 rounded-lg ${
                    error.includes('Check your email')
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmail('');
                      setError('');
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 disabled:bg-white/5 py-3 rounded-lg transition-colors"
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="text-6xl mb-4">✉️</div>
                <p className="text-white/80 mb-6">
                  Password reset email sent! Check your inbox and follow the instructions.
                </p>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetSent(false);
                    setResetEmail('');
                    setError('');
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 px-6 py-3 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
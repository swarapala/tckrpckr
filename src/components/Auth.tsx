import React, { useState } from 'react';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
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
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Welcome Back</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all text-white placeholder:text-white/30"
                placeholder="demo@tckrpckr.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all text-white placeholder:text-white/30"
                placeholder="••••••••"
              />
            </div>

            <button
              type="button"
              onClick={() => onLogin()}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 border border-white/20 hover:border-white/30"
            >
              Enter Demo
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/40">
              Demo mode • No authentication required
            </p>
          </div>
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
    </div>
  );
};

export default Auth;
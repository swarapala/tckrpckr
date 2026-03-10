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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-3">
            <span className="text-green-400">tckr</span>
            <span className="text-red-400">pckr</span>
          </h1>
          <p className="text-slate-400 text-lg">AI-Powered Stock Analysis</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="demo@tckrpckr.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="button"
              onClick={() => onLogin()}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/20"
            >
              Enter Demo
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Demo mode • No authentication required
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
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
        <div className="text-center mt-8 text-sm text-slate-500">
          <p>© 2026 <span className="text-green-400">tckr</span><span className="text-red-400">pckr</span></p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
import React from 'react';
import { Check } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-white/60">Manage your account preferences and configurations</p>
      </div>

      {/* Account Section */}
      <div className="bg-black rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="font-medium">Plan</div>
              <div className="text-sm text-white/60">Free Trial</div>
            </div>
            <button className="bg-emerald-700 hover:bg-emerald-800 px-4 py-2 rounded-lg text-sm transition-colors">
              Upgrade to Pro
            </button>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="font-medium mb-2">Email</div>
            <div className="text-sm text-white/60">demo@tickpickv1.com</div>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-black rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="font-medium">Real-time Updates</div>
              <div className="text-sm text-white/60">Refresh portfolio every 60 seconds</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="font-medium">Price Alerts</div>
              <div className="text-sm text-white/60">Get notified on significant price changes</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="font-medium">Dark Mode</div>
              <div className="text-sm text-white/60">Currently enabled</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
            </label>
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <div className="bg-black rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">Alpaca API</div>
              <div className="flex items-center gap-2 text-sm text-green-400">
                <Check size={16} />
                Connected
              </div>
            </div>
            <div className="text-sm text-white/60">Real-time market data provider</div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">Claude AI</div>
              <div className="flex items-center gap-2 text-sm text-green-400">
                <Check size={16} />
                Connected
              </div>
            </div>
            <div className="text-sm text-white/60">AI-powered analysis and recommendations</div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-black rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold mb-4">About tckrpckr</h2>        <div className="space-y-3 text-sm">
          <div className="flex justify-between p-3 bg-white/5 rounded-lg">
            <span className="text-white/60">Version</span>
            <span className="font-medium">1.0.0 Beta</span>
          </div>
          <div className="flex justify-between p-3 bg-white/5 rounded-lg">
            <span className="text-white/60">Last Updated</span>
            <span className="font-medium">March 8, 2026</span>
          </div>
          <div className="flex justify-between p-3 bg-white/5 rounded-lg">
            <span className="text-white/60">Developer</span>
            <span className="font-medium">Swara Palanivel</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
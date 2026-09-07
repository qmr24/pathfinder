'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Key, Mail, AlertCircle, Lock } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (email && password) {
        localStorage.setItem('pathfinder_admin_auth', JSON.stringify({
          role: 'super_admin',
          email: email,
          name: 'Super Admin'
        }));
        router.push('/admin/dashboard');
      } else {
        setError('Invalid administrative credentials.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-rose-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {APP_NAME} Admin Portal
          </h2>
          <p className="text-xs text-rose-400 font-semibold uppercase tracking-wider">
            Restricted Administrative Access Only
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/70 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pathfinders.lk"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-950 border border-slate-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-950 border border-slate-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors flex items-center justify-center gap-2 text-sm shadow-lg mt-2"
          >
            {loading ? (
              <span>Authenticating Security Credentials...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Sign In to Admin Portal
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Fill Helper */}
        <div className="p-3 bg-slate-950/80 rounded-xl text-center text-xs space-y-1 text-slate-400 border border-slate-800">
          <p className="font-semibold text-rose-300">Quick Admin Preview</p>
          <p>Email: <code className="text-slate-200">admin@pathfinders.lk</code></p>
          <p>Password: <code className="text-slate-200">admin123</code></p>
          <button
            onClick={() => {
              setEmail('admin@pathfinders.lk');
              setPassword('admin123');
            }}
            className="mt-1 text-[11px] text-rose-400 font-bold underline"
          >
            Auto Fill Admin Credentials
          </button>
        </div>
      </div>
    </div>
  );
}

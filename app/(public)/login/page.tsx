'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Key, Mail, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // Authenticate student session
      if (email && password) {
        localStorage.setItem('pathfinder_auth', JSON.stringify({
          role: 'student',
          email: email,
          name: email.split('@')[0].toUpperCase(),
          student_id: 'PF-2026-089'
        }));
        router.push('/dashboard');
      } else {
        setError('Please enter your valid registered email and password.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 font-black text-xl flex items-center justify-center mx-auto shadow-md">
            PF
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Student Login
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to access your student dashboard, monthly marks, and resource library.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Registered Email or Student Identifier
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kamal@student.lk or PF-2026-089"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center justify-center gap-2 text-sm shadow-md"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In to Student Portal
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Fill Helper */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-center text-xs space-y-1 text-slate-500 border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-300">Quick Student Preview</p>
          <p>Email: <code className="text-emerald-600 dark:text-emerald-400">student@pathfinders.lk</code></p>
          <p>Password: <code className="text-emerald-600 dark:text-emerald-400">student123</code></p>
          <button
            onClick={() => {
              setEmail('student@pathfinders.lk');
              setPassword('student123');
            }}
            className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold underline"
          >
            Auto Fill Credentials
          </button>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 space-y-2">
          <p>
            Don't have a student account yet?{' '}
            <Link href="/signup" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
              Create Student Account
            </Link>
          </p>
          <p>
            Are you an Administrator?{' '}
            <Link href="/admin/login" className="text-rose-500 font-semibold hover:underline">
              Admin Portal Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Key, Mail, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      
      // Attempt real Supabase Authentication
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (authError) {
        // If Supabase is configured and returned auth error
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
          setError(authError.message || 'Invalid email or password.');
          setLoading(false);
          return;
        }

        // Demo Mode Fallback — Strictly validate against valid demo credentials
        const validStudentEmail = 'student@pathfinders.lk';
        const validStudentPass = 'student123';

        if (email.trim().toLowerCase() === validStudentEmail && password === validStudentPass) {
          localStorage.setItem('pathfinder_auth', JSON.stringify({
            role: 'student',
            email: email,
            name: 'Kamal Perera',
            student_id: 'PF-2026-089'
          }));
          router.push('/dashboard');
        } else if (email && password && password !== validStudentPass && email !== validStudentEmail) {
          setError('Invalid email or password. Access denied.');
          setLoading(false);
          return;
        } else {
          // If custom user registered locally
          const existingUser = localStorage.getItem(`pathfinder_user_${email.trim().toLowerCase()}`);
          if (existingUser) {
            const userObj = JSON.parse(existingUser);
            if (userObj.password === password) {
              localStorage.setItem('pathfinder_auth', JSON.stringify(userObj));
              router.push('/dashboard');
              return;
            }
          }
          setError('Invalid credentials. Password does not match registered student account.');
          setLoading(false);
          return;
        }
      } else if (data?.user) {
        // Real Supabase User Logged In
        localStorage.setItem('pathfinder_auth', JSON.stringify({
          role: 'student',
          email: data.user.email,
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
          student_id: data.user.user_metadata?.student_id || 'PF-2026-001'
        }));
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError('Authentication failed. Please check your credentials.');
      setLoading(false);
    }
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
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Registered Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kamal@student.lk"
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
              <span>Verifying Password...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In to Student Portal
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-center text-xs space-y-1 text-slate-500 border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-300">Valid Demo Student Credentials</p>
          <p>Email: <code className="text-emerald-600 dark:text-emerald-400">student@pathfinders.lk</code></p>
          <p>Password: <code className="text-emerald-600 dark:text-emerald-400">student123</code></p>
          <button
            onClick={() => {
              setEmail('student@pathfinders.lk');
              setPassword('student123');
            }}
            className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold underline"
          >
            Auto Fill Valid Credentials
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

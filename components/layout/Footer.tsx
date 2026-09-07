import React from 'react';
import Link from 'next/link';
import { APP_NAME, APP_TAGLINE } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-extrabold text-base shadow-sm">
                PF
              </div>
              <span className="text-white font-bold text-lg tracking-wider">{APP_NAME}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {APP_TAGLINE}
            </p>
            <p className="text-xs text-slate-500">
              Dedicated Learning Management System for Sri Lankan G.C.E. Advanced Level Commerce Stream.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Path Finders</Link></li>
              <li><Link href="/resources" className="hover:text-emerald-400 transition-colors">Public Library</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Student Portal */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">Student Portal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Student Login</Link></li>
              <li><Link href="/signup" className="hover:text-emerald-400 transition-colors">Create Student Account</Link></li>
              <li><Link href="/dashboard/progress" className="hover:text-emerald-400 transition-colors">Monthly Progress</Link></li>
              <li><Link href="/dashboard/term-exams" className="hover:text-emerald-400 transition-colors">Four Term Examinations</Link></li>
            </ul>
          </div>

          {/* Administrative Portal */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">Administration</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/admin/login" className="hover:text-rose-400 transition-colors">Authorized Admin Access</Link></li>
              <li className="text-slate-500 pt-2">System Status: <span className="text-emerald-400 font-semibold">Operational (Free Tier)</span></li>
              <li className="text-slate-500">Security: <span className="text-emerald-400 font-semibold">Row-Level Security (RLS)</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {APP_NAME} LMS. All rights reserved.</p>
          <p className="text-slate-500">Built for Sri Lankan Commerce A/L Students</p>
        </div>
      </div>
    </footer>
  );
}

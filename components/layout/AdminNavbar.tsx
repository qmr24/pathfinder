'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Users, Edit3, FolderCheck, Lock, History, LogOut, LayoutDashboard, FileSpreadsheet } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('pathfinder_admin_auth');
    router.push('/admin/login');
  };

  return (
    <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Admin Brand */}
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 rounded bg-rose-600 flex items-center justify-center text-white font-extrabold text-sm">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold tracking-tight">{APP_NAME}</span>
              <span className="text-[10px] font-semibold text-rose-400 -mt-1 uppercase tracking-wider">ADMIN PORTAL</span>
            </div>
          </Link>

          {/* Admin Navigation Menu */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            <Link
              href="/admin/dashboard"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${pathname === '/admin/dashboard' ? 'bg-rose-950 text-rose-300 border border-rose-800/50' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </Link>
            <Link
              href="/admin/students"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${pathname === '/admin/students' ? 'bg-rose-950 text-rose-300 border border-rose-800/50' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
            >
              <Users className="w-4 h-4" />
              Students
            </Link>
            <Link
              href="/admin/marks"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${pathname === '/admin/marks' ? 'bg-rose-950 text-rose-300 border border-rose-800/50' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Marks Engine
            </Link>
            <Link
              href="/admin/assessments"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${pathname === '/admin/assessments' ? 'bg-rose-950 text-rose-300 border border-rose-800/50' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
            >
              <Edit3 className="w-4 h-4" />
              Assessments & Exams
            </Link>
            <Link
              href="/admin/resources"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${pathname === '/admin/resources' ? 'bg-rose-950 text-rose-300 border border-rose-800/50' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
            >
              <FolderCheck className="w-4 h-4" />
              Resource Library
            </Link>
            <Link
              href="/admin/roles"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${pathname === '/admin/roles' ? 'bg-rose-950 text-rose-300 border border-rose-800/50' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
            >
              <Lock className="w-4 h-4" />
              Roles
            </Link>
            <Link
              href="/admin/audit-logs"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${pathname === '/admin/audit-logs' ? 'bg-rose-950 text-rose-300 border border-rose-800/50' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
            >
              <History className="w-4 h-4" />
              Audit Logs
            </Link>
          </nav>

          {/* Admin Profile & Logout */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-semibold text-rose-400 bg-rose-950 px-2.5 py-1 rounded border border-rose-800/60">
              Super Admin
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-700 rounded-md transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              Exit Admin
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

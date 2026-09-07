'use client';

import React from 'react';
import Link from 'next/link';
import AdminNavbar from '@/components/layout/AdminNavbar';
import { Users, FileSpreadsheet, FolderCheck, Shield, Plus, ArrowUpRight, CheckCircle2, History } from 'lucide-react';
import { MOCK_RESOURCES, MOCK_MONTHLY_MARKS } from '@/lib/mockData';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-rose-950 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-950 border border-rose-800 text-rose-300 text-xs font-bold rounded-full">
              <Shield className="w-3.5 h-3.5" /> Super Administrator Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Path Finders Administration Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Manage student accounts, record monthly assessment & term exam marks, publish resources, and monitor audit trails.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/marks"
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm transition-all shadow flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" /> Enter Marks Engine
            </Link>
            <Link
              href="/admin/resources"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5"
            >
              <FolderCheck className="w-4 h-4" /> Upload Document
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Enrolled Students</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-white">128</p>
            <p className="text-[11px] text-emerald-400 font-medium">84 Comb 1 (ICT) | 44 Comb 2 (BS)</p>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Recorded Monthly Marks</span>
              <FileSpreadsheet className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-3xl font-black text-white">768</p>
            <p className="text-[11px] text-rose-400 font-medium">Jan - Mar Assessments 01 & 02</p>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Library Resources</span>
              <FolderCheck className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-3xl font-black text-white">{MOCK_RESOURCES.length}</p>
            <p className="text-[11px] text-blue-400 font-medium">Notes, Past Papers & Models</p>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Active Admin Users</span>
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-3xl font-black text-white">3</p>
            <p className="text-[11px] text-amber-400 font-medium">Super & Content Admins</p>
          </div>
        </div>

        {/* Action Shortcuts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" /> Student Administration
            </h3>
            <p className="text-xs text-slate-400">
              Search students by name or ID, view academic transcripts, and manage active status.
            </p>
            <Link
              href="/admin/students"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline"
            >
              Open Student Directory <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-rose-400" /> Assessment & Term Marks
            </h3>
            <p className="text-xs text-slate-400">
              Fast mark entry grid for monthly assessments (01 & 02) and 4 term examinations.
            </p>
            <Link
              href="/admin/marks"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:underline"
            >
              Enter Marks Console <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <History className="w-5 h-5 text-amber-400" /> Security Audit Log
            </h3>
            <p className="text-xs text-slate-400">
              Complete audit trail tracking all mark changes, administrator edits, and timestamp logs.
            </p>
            <Link
              href="/admin/audit-logs"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:underline"
            >
              View Audit History <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import AdminNavbar from '@/components/layout/AdminNavbar';
import { Lock, Shield, UserCheck, Plus, CheckCircle2, Trash2 } from 'lucide-react';

export default function AdminRolesPage() {
  const [adminsList, setAdminsList] = useState([
    { id: '1', name: 'Dr. Nimal Senanayake', email: 'admin@pathfinders.lk', role: 'super_admin', grantedBy: 'System' },
    { id: '2', name: 'Sunil Rathnayake', email: 'academic@pathfinders.lk', role: 'academic_admin', grantedBy: 'Dr. Nimal' },
    { id: '3', name: 'Kanthi Perera', email: 'content@pathfinders.lk', role: 'content_admin', grantedBy: 'Dr. Nimal' },
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Lock className="w-7 h-7 text-rose-500" /> Admin Role Permissions Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Super Administrator console to grant and revoke granular roles (Super Admin, Academic Admin, Content Admin).
          </p>
        </div>

        {/* Roles Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-rose-950 text-rose-400 font-bold text-[10px] uppercase border border-rose-800">
              Super Admin
            </span>
            <h3 className="font-bold text-white text-base">Full System Access</h3>
            <p className="text-xs text-slate-400">
              Can manage student accounts, marks, resources, administrative roles, and system settings.
            </p>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-400 font-bold text-[10px] uppercase border border-purple-800">
              Academic Admin
            </span>
            <h3 className="font-bold text-white text-base">Marks & Examinations</h3>
            <p className="text-xs text-slate-400">
              Can record and edit monthly assessment marks, term examination results, and view student profiles.
            </p>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-blue-950 text-blue-400 font-bold text-[10px] uppercase border border-blue-800">
              Content Admin
            </span>
            <h3 className="font-bold text-white text-base">Library & Materials</h3>
            <p className="text-xs text-slate-400">
              Can upload, organize, edit, and archive notes, past papers, model answers, and revision guides.
            </p>
          </div>
        </div>

        {/* Active Admins Directory */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white">Authorized Administrators</h3>
          </div>

          <div className="divide-y divide-slate-800">
            {adminsList.map((admin) => (
              <div key={admin.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-white text-sm">{admin.name}</p>
                  <p className="text-xs text-slate-400">{admin.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-slate-950 text-rose-400 border border-slate-800 font-bold text-xs">
                    {admin.role.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

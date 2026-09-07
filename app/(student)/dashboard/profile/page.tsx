'use client';

import React, { useState, useEffect } from 'react';
import { User, Shield, CheckCircle2, Lock, Save, AlertCircle } from 'lucide-react';
import { MOCK_STUDENT_PROFILE } from '@/lib/mockData';

export default function StudentProfilePage() {
  const [profile, setProfile] = useState(MOCK_STUDENT_PROFILE);
  const [phone, setPhone] = useState(MOCK_STUDENT_PROFILE.phone_number || '');
  const [school, setSchool] = useState(MOCK_STUDENT_PROFILE.school || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <User className="w-7 h-7 text-emerald-500" /> Student Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          View your private student identification and update editable contact information.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Profile contact details updated successfully!
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-md">
            {profile.full_name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{profile.full_name}</h2>
            <p className="text-xs text-slate-500">{profile.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
              Student Account Active
            </span>
          </div>
        </div>

        {/* Protected Academic Information (Read-Only) */}
        <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-500" /> Academic & System Records (Read-Only)
            </h3>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">Protected by Admin</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
            <div>
              <p className="text-slate-400 font-medium">Student Identifier</p>
              <p className="font-mono font-bold text-slate-900 dark:text-white text-sm">{profile.student_id}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">A/L Batch Year</p>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{profile.al_year} Batch</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Subject Combination</p>
              <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{profile.combination?.name}</p>
            </div>
          </div>
        </div>

        {/* Editable Information Form */}
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Editable Personal Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">School / Institution</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors text-xs flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" /> Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React from 'react';
import { Target, Award, Users, BookOpen, ShieldCheck, HeartHandshake } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About <span className="text-emerald-500">{APP_NAME}</span>
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Dedicated Learning Management System designed to empower Sri Lankan Commerce stream G.C.E. Advanced Level students toward academic excellence.
        </p>
      </div>

      {/* Vision & Purpose Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Educational Mission</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Path Finders was created to bridge the gap between classroom teaching and continuous performance measurement. We provide Commerce A/L students with clear, data-driven insights into their progress, enabling them to identify weak areas months before their final national examination.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Streamlined Commerce Focus</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Unlike generic platforms, Path Finders is built exclusively around Sri Lanka's official Commerce stream subjects: Accounting, Economics, Information & Communication Technology (ICT), and Business Studies.
          </p>
        </div>
      </div>

      {/* Core Principles */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">Core Platform Pillars</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-100 dark:bg-slate-900/60 p-6 rounded-xl space-y-2 border border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">100% Student Privacy</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Database Row-Level Security guarantees no student can view or tamper with another student's marks.
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-900/60 p-6 rounded-xl space-y-2 border border-slate-200 dark:border-slate-800">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Curated Resources</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Only verified past papers, notes, and model answers are made available to enrolled students.
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-900/60 p-6 rounded-xl space-y-2 border border-slate-200 dark:border-slate-800">
            <HeartHandshake className="w-6 h-6 text-purple-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Zero Cost Guarantee</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Operating on robust free-tier architecture, ensuring equal learning opportunities for all students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

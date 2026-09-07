'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart3, GraduationCap, BookOpen, User, CheckCircle2, TrendingUp, ArrowUpRight, Clock, Award } from 'lucide-react';
import { MOCK_STUDENT_PROFILE, MOCK_MONTHLY_MARKS, MOCK_TERM_MARKS } from '@/lib/mockData';
import { formatAverage } from '@/lib/utils';
import MonthlyProgressChart from '@/components/charts/MonthlyProgressChart';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(MOCK_STUDENT_PROFILE);

  useEffect(() => {
    const authData = localStorage.getItem('pathfinder_auth');
    if (!authData) {
      router.push('/login');
    } else {
      try {
        const userObj = JSON.parse(authData);
        setProfile({
          full_name: userObj.name || userObj.fullName || 'Student',
          student_id: userObj.student_id || 'PF-2026-089',
          school: userObj.school || 'Ananda College, Colombo',
          al_year: userObj.al_year || userObj.alYear || 2026,
          combination: userObj.combination || MOCK_STUDENT_PROFILE.combination
        });
      } catch (err) {
        // Fallback
      }
    }
  }, [router]);

  // Calculate stats from actual database mock
  const totalAssessmentsCompleted = MOCK_MONTHLY_MARKS.length;
  const monthlyAverage = MOCK_MONTHLY_MARKS.reduce((acc, m) => acc + m.marks_obtained, 0) / (totalAssessmentsCompleted || 1);
  const termAverage = MOCK_TERM_MARKS.reduce((acc, m) => acc + m.marks_obtained, 0) / (MOCK_TERM_MARKS.length || 1);
  const overallAverage = (monthlyAverage + termAverage) / 2;
  const latestMark = MOCK_MONTHLY_MARKS[MOCK_MONTHLY_MARKS.length - 1];

  // Chart data for monthly trend
  const chartData = [
    { month: 'Jan', assessment1: 78, assessment2: 84, monthlyAverage: 81 },
    { month: 'Feb', assessment1: 82, assessment2: 88, monthlyAverage: 85 },
    { month: 'Mar', assessment1: 91, assessment2: 86, monthlyAverage: 88.5 },
    { month: 'Apr', assessment1: null, assessment2: null, monthlyAverage: null },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled Student Session Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, <span className="text-emerald-400">{profile.full_name}</span>!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Student ID: <span className="font-mono text-emerald-300 font-bold">{profile.student_id}</span> | {profile.school} | Batch {profile.al_year}
          </p>
          <p className="text-xs text-slate-400">
            Subject Combination: <strong className="text-slate-200">{profile.combination?.name || 'Combination 1'} ({profile.combination?.displayName || 'Accounting + Economics + ICT'})</strong>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/progress"
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow flex items-center gap-1.5"
          >
            <BarChart3 className="w-4 h-4" /> View Full Progress
          </Link>
          <Link
            href="/dashboard/library"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" /> Access Library
          </Link>
        </div>
      </div>

      {/* Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Average */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Overall Average</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {formatAverage(overallAverage)}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            +3.2% from last month
          </p>
        </div>

        {/* Monthly Assessments Completed */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Assessments</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {totalAssessmentsCompleted} <span className="text-sm font-normal text-slate-400">tests</span>
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            Monthly MCQ & Essay Tasks
          </p>
        </div>

        {/* Term Examination Average */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Term Exam Average</span>
            <GraduationCap className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {formatAverage(termAverage)}
          </p>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
            Across 4 Term Examinations
          </p>
        </div>

        {/* Latest Result */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Latest Result</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {latestMark?.marks_obtained}%
          </p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            {latestMark?.monthName} ({latestMark?.subjectCode}) — Grade {latestMark?.grade}
          </p>
        </div>
      </div>

      {/* Progress Chart Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MonthlyProgressChart data={chartData} />
        </div>

        {/* Recent Assessment Summary List */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Monthly Marks</h3>
            <Link href="/dashboard/progress" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline">
              View All <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
            {MOCK_MONTHLY_MARKS.slice(-4).reverse().map((mark) => (
              <div key={mark.id} className="pt-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{mark.monthName} Assessment</p>
                  <p className="text-slate-500">{mark.subjectCode} Stream</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{mark.marks_obtained}%</span>
                  <span className="ml-2 px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                    Grade {mark.grade}
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

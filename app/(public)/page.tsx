import React from 'react';
import Link from 'next/link';
import { BookOpen, BarChart3, GraduationCap, CheckCircle2, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/30 via-slate-900 to-slate-950"></div>
        
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Sri Lankan Commerce A/L LMS
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Your Journey to A/L Success <br className="hidden sm:inline" />
            Starts Here with <span className="text-emerald-400">{APP_NAME}</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            A modern, simple, and secure platform empowering Commerce A/L students to track monthly assessments, visualize term examination results, and access curated subject notes & papers.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg hover:shadow-emerald-900/30 flex items-center justify-center gap-2 text-base"
            >
              Get Started — Create Account
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all text-base"
            >
              Student Login
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/80">
            <div className="p-3 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">2</p>
              <p className="text-xs text-slate-400 font-medium">Subject Combinations</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">2 / Mo</p>
              <p className="text-xs text-slate-400 font-medium">Monthly Assessments</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">4</p>
              <p className="text-xs text-slate-400 font-medium">Term Examinations</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</p>
              <p className="text-xs text-slate-400 font-medium">Free Access ($0 Cost)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Path Finders */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Why Choose Path Finders?</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm">
            Built specifically to solve the core academic tracking needs of Commerce stream A/L students in Sri Lanka.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Visual Progress Graphs</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Track your scores month-by-month and across all four term exams with clear, interactive line graphs that update automatically.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Subject Resource Library</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Access lecture notes, past papers, model papers, and revision documents tailored to your selected subject combination.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Ironclad Privacy & Security</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Your personal information and academic marks are protected by database Row-Level Security (RLS). Only you can see your data.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Journey */}
      <section className="bg-slate-100 dark:bg-slate-900/50 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">How Path Finders Works</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm">
              Your step-by-step roadmap from enrollment to A/L examination excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center">1</span>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">Create Account</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Register your student profile and select your A/L Commerce subject combination.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center">2</span>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">Learn & Practice</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Study using subject notes, model papers, and complete monthly Google Form assessments.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center">3</span>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">Receive Marks</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                View monthly assessment results and 4 term examination marks securely on your dashboard.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center">4</span>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">Track & Improve</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Analyze performance graphs, identify weak areas, and continuously boost your grades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commerce Subject Streams Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Supported Subject Combinations</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm">
            We cater directly to Sri Lanka's official Commerce A/L subject combinations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Combination 1 */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
            <div className="inline-block px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold rounded-md">
              Combination 01
            </div>
            <h3 className="text-xl font-extrabold text-white">Accounting + Economics + ICT</h3>
            <p className="text-xs text-slate-400">
              Designed for Commerce students aiming for Accounting, Finance, Management Information Systems, and Tech careers.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Accounting (G.C.E. A/L Syllabus)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Economics (G.C.E. A/L Syllabus)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Information & Communication Technology (ICT)</li>
            </ul>
          </div>

          {/* Combination 2 */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
            <div className="inline-block px-3 py-1 bg-blue-950 border border-blue-800 text-blue-400 text-xs font-bold rounded-md">
              Combination 02
            </div>
            <h3 className="text-xl font-extrabold text-white">Accounting + Economics + Business Studies</h3>
            <p className="text-xs text-slate-400">
              Designed for Commerce students aiming for Business Administration, Marketing, Management, and Commerce degrees.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Accounting (G.C.E. A/L Syllabus)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Economics (G.C.E. A/L Syllabus)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Business Studies (BS)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-slate-950 p-8 sm:p-12 rounded-3xl text-center space-y-6 shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Take Control of Your A/L Progress?
          </h2>
          <p className="text-emerald-100 max-w-xl mx-auto text-sm sm:text-base">
            Join Path Finders today. It takes less than 2 minutes to create your student account.
          </p>
          <div className="pt-2">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-slate-950 text-white hover:bg-slate-900 transition-all shadow-lg text-sm sm:text-base"
            >
              Register Now — It's Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

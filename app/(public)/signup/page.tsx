'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, CheckCircle2, AlertCircle, Shield, BookOpen } from 'lucide-react';
import { SUBJECT_COMBINATIONS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';

export default function StudentSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    school: '',
    alYear: '2026',
    combinationId: SUBJECT_COMBINATIONS[0].id,
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const selectedComb = SUBJECT_COMBINATIONS.find(c => c.id === formData.combinationId);
      const generatedStudentId = `PF-${formData.alYear}-${Math.floor(100 + Math.random() * 900)}`;

      // Attempt Supabase Auth Sign Up
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            student_id: generatedStudentId,
            school: formData.school,
            phone_number: formData.phone,
            al_year: parseInt(formData.alYear),
            combination_id: formData.combinationId
          }
        }
      });

      // Save student profile data
      const studentProfile = {
        role: 'student',
        email: formData.email.trim().toLowerCase(),
        password: formData.password, // Local fallback check
        name: formData.fullName,
        student_id: generatedStudentId,
        school: formData.school || 'Commerce Stream School',
        phone_number: formData.phone,
        al_year: parseInt(formData.alYear),
        combination: selectedComb
      };

      // Store account so user can log in with their exact email & password
      localStorage.setItem(`pathfinder_user_${formData.email.trim().toLowerCase()}`, JSON.stringify(studentProfile));
      localStorage.setItem('pathfinder_auth', JSON.stringify(studentProfile));

      setLoading(false);
      router.push('/dashboard');
    } catch (err: any) {
      setError('Account creation failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-xl w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 font-black text-xl flex items-center justify-center mx-auto shadow-md">
            PF
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Create Student Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Join Path Finders LMS to track your Commerce stream monthly marks and term exams.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                placeholder="e.g. Kamal Perera"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="kamal@student.lk"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* School & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                School / Institution
              </label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData({...formData, school: e.target.value})}
                placeholder="e.g. Ananda College, Colombo"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+94 77 123 4567"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* A/L Batch Year */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Target A/L Batch Year
            </label>
            <select
              value={formData.alYear}
              onChange={(e) => setFormData({...formData, alYear: e.target.value})}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="2026">2026 A/L Batch</option>
              <option value="2027">2027 A/L Batch</option>
              <option value="2028">2028 A/L Batch</option>
            </select>
          </div>

          {/* Subject Combination Selection */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-900 dark:text-white">
              Select Your A/L Commerce Subject Combination <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3">
              {SUBJECT_COMBINATIONS.map(comb => (
                <label
                  key={comb.id}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    formData.combinationId === comb.id
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="combination"
                    value={comb.id}
                    checked={formData.combinationId === comb.id}
                    onChange={() => setFormData({...formData, combinationId: comb.id})}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {comb.name}: {comb.displayName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Subjects: {comb.subjects.join(', ')}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Create Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center justify-center gap-2 text-sm shadow-md mt-4"
          >
            {loading ? (
              <span>Creating Your Account...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Create Student Account
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link href="/login" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}

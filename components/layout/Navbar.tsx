'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, User, LogOut, Menu, X, BarChart3, GraduationCap, FileText } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentName, setStudentName] = useState('Student');

  useEffect(() => {
    // Check local storage or auth cookie status
    const mockAuth = localStorage.getItem('pathfinder_auth');
    if (mockAuth) {
      const authObj = JSON.parse(mockAuth);
      if (authObj.role === 'student') {
        setIsLoggedIn(true);
        setStudentName(authObj.name || 'Student');
      }
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('pathfinder_auth');
    setIsLoggedIn(false);
    router.push('/login');
  };

  const isStudentRoute = pathname?.startsWith('/dashboard');
  const isAdminRoute = pathname?.startsWith('/admin') && pathname !== '/admin/login';

  if (isAdminRoute) {
    return null; // Admin has its own dedicated AdminNavbar
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-extrabold text-lg shadow-sm">
              PF
            </div>
            <div className="flex flex-col">
              <span className="text-white font-extrabold tracking-wider">{APP_NAME}</span>
              <span className="text-[10px] font-medium text-emerald-400 -mt-1 tracking-widest uppercase">COMMERCE A/L LMS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 font-medium text-sm">
            {!isLoggedIn ? (
              <>
                <Link href="/" className={`px-3 py-2 rounded-md transition-colors ${pathname === '/' ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'}`}>
                  Home
                </Link>
                <Link href="/about" className={`px-3 py-2 rounded-md transition-colors ${pathname === '/about' ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'}`}>
                  About
                </Link>
                <Link href="/resources" className={`px-3 py-2 rounded-md transition-colors ${pathname === '/resources' ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'}`}>
                  Library Resources
                </Link>
                <Link href="/contact" className={`px-3 py-2 rounded-md transition-colors ${pathname === '/contact' ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'}`}>
                  Contact
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${pathname === '/dashboard' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'}`}>
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link href="/dashboard/progress" className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${pathname === '/dashboard/progress' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'}`}>
                  <BarChart3 className="w-4 h-4" />
                  My Progress
                </Link>
                <Link href="/dashboard/term-exams" className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${pathname === '/dashboard/term-exams' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'}`}>
                  <GraduationCap className="w-4 h-4" />
                  Term Exams
                </Link>
                <Link href="/dashboard/library" className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${pathname === '/dashboard/library' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'}`}>
                  <BookOpen className="w-4 h-4" />
                  Library
                </Link>
                <Link href="/dashboard/profile" className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${pathname === '/dashboard/profile' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'}`}>
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Right Action */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="px-4 py-2 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-all hover:shadow">
                  Create Account
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                  {studentName}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 border border-rose-900/50 rounded-lg transition-colors flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {!isLoggedIn ? (
            <>
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800">
                Home
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800">
                About
              </Link>
              <Link href="/resources" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800">
                Library Resources
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800">
                Contact
              </Link>
              <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center px-4 py-2.5 rounded-lg font-medium text-slate-200 bg-slate-800">
                  Login
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full text-center px-4 py-2.5 rounded-lg font-semibold text-slate-950 bg-emerald-400">
                  Create Student Account
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="px-3 py-2 font-semibold text-sm text-emerald-400 border-b border-slate-800 mb-2">
                Signed in as {studentName}
              </div>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800">
                Dashboard Overview
              </Link>
              <Link href="/dashboard/progress" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800">
                My Progress & Graphs
              </Link>
              <Link href="/dashboard/term-exams" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800">
                Term Examination Results
              </Link>
              <Link href="/dashboard/library" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800">
                Subject Learning Library
              </Link>
              <Link href="/dashboard/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800">
                Student Profile
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full mt-4 text-left px-3 py-2.5 text-rose-400 hover:bg-rose-950/50 rounded-md font-medium"
              >
                Logout Account
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

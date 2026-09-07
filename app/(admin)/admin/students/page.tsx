'use client';

import React, { useState } from 'react';
import AdminNavbar from '@/components/layout/AdminNavbar';
import { Search, Users, Filter, Eye, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';
import { MOCK_STUDENT_PROFILE } from '@/lib/mockData';

export default function AdminStudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCombFilter, setSelectedCombFilter] = useState('ALL');

  const studentsList = [
    { id: '1', name: 'Kamal Perera', studentId: 'PF-2026-089', email: 'kamal.perera@student.lk', school: 'Ananda College, Colombo', year: 2026, comb: 'Combination 1 (ACC, ECON, ICT)', status: 'active' },
    { id: '2', name: 'Nipuni Silva', studentId: 'PF-2026-092', email: 'nipuni.silva@student.lk', school: 'Visakha Vidyalaya', year: 2026, comb: 'Combination 2 (ACC, ECON, BS)', status: 'active' },
    { id: '3', name: 'Kasun Fernando', studentId: 'PF-2026-104', email: 'kasun.f@student.lk', school: 'St. Joseph\'s College', year: 2026, comb: 'Combination 1 (ACC, ECON, ICT)', status: 'active' },
    { id: '4', name: 'Dilini Bandara', studentId: 'PF-2026-118', email: 'dilini.b@student.lk', school: 'Maliyadeva College', year: 2026, comb: 'Combination 2 (ACC, ECON, BS)', status: 'suspended' },
  ];

  const filteredStudents = studentsList.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.school.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesComb = selectedCombFilter === 'ALL' || student.comb.includes(selectedCombFilter);
    return matchesSearch && matchesComb;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Users className="w-7 h-7 text-emerald-400" /> Student Directory & Accounts
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              View, search, filter, and manage enrolled Commerce A/L student profiles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              Total Enrolled: {filteredStudents.length} Students
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student name, ID (PF-2026-xxx), or school..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Stream Filter:
            </span>
            <button
              onClick={() => setSelectedCombFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${selectedCombFilter === 'ALL' ? 'bg-rose-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
            >
              All Streams
            </button>
            <button
              onClick={() => setSelectedCombFilter('Combination 1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${selectedCombFilter === 'Combination 1' ? 'bg-rose-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
            >
              Comb 1 (ICT)
            </button>
            <button
              onClick={() => setSelectedCombFilter('Combination 2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${selectedCombFilter === 'Combination 2' ? 'bg-rose-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
            >
              Comb 2 (BS)
            </button>
          </div>
        </div>

        {/* Student Table */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-950 text-slate-400 uppercase font-bold text-[11px] tracking-wider border-b border-slate-800">
                  <th className="p-4">Student ID & Name</th>
                  <th className="p-4">School</th>
                  <th className="p-4">Batch</th>
                  <th className="p-4">Subject Combination</th>
                  <th className="p-4 text-center">Account Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-white text-sm">{student.name}</p>
                      <p className="font-mono text-[11px] text-emerald-400">{student.studentId} • {student.email}</p>
                    </td>
                    <td className="p-4 text-slate-300">{student.school}</td>
                    <td className="p-4 font-bold text-white">{student.year} A/L</td>
                    <td className="p-4 text-slate-300 text-xs">{student.comb}</td>
                    <td className="p-4 text-center">
                      {student.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold text-[10px]">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-800 text-rose-400 font-bold text-[10px]">
                          <XCircle className="w-3 h-3" /> Suspended
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ml-auto">
                        <Eye className="w-3.5 h-3.5" /> Transcripts
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

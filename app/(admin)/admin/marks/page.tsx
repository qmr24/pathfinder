'use client';

import React, { useState } from 'react';
import AdminNavbar from '@/components/layout/AdminNavbar';
import { FileSpreadsheet, Save, CheckCircle2, Upload, Download, AlertCircle } from 'lucide-react';
import { calculateGrade } from '@/lib/utils';

export default function AdminMarksPage() {
  const [entryType, setEntryType] = useState<'monthly' | 'term'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedAssessment, setSelectedAssessment] = useState('1');
  const [selectedSubject, setSelectedSubject] = useState('ACC');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Student list for bulk entry
  const [marksGrid, setMarksGrid] = useState([
    { id: '1', name: 'Kamal Perera', studentId: 'PF-2026-089', score: '78', grade: 'A', remarks: 'Good work' },
    { id: '2', name: 'Nipuni Silva', studentId: 'PF-2026-092', score: '84', grade: 'A', remarks: 'Excellent' },
    { id: '3', name: 'Kasun Fernando', studentId: 'PF-2026-104', score: '62', grade: 'C', remarks: 'Needs revision' },
    { id: '4', name: 'Dilini Bandara', studentId: 'PF-2026-118', score: '91', grade: 'A', remarks: 'Outstanding' },
  ]);

  const handleScoreChange = (id: string, newScore: string) => {
    const num = parseFloat(newScore);
    const calculated = isNaN(num) ? '' : calculateGrade(num);
    setMarksGrid(prev => prev.map(item => item.id === id ? { ...item, score: newScore, grade: calculated } : item));
  };

  const handleSaveMarks = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-7 h-7 text-rose-500" /> Academic Marks Entry Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Record, edit, and bulk import monthly assessment scores and 4 term examination results.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors">
              <Upload className="w-3.5 h-3.5 text-emerald-400" /> Import CSV
            </button>
            <button className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors">
              <Download className="w-3.5 h-3.5 text-blue-400" /> Export Template
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Marks saved to database successfully & audit log entry generated!
          </div>
        )}

        {/* Configuration Selector */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
            <button
              onClick={() => setEntryType('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${entryType === 'monthly' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
            >
              Monthly Assessment Marks Entry
            </button>
            <button
              onClick={() => setEntryType('term')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${entryType === 'term' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
            >
              Term Examination Marks Entry
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {entryType === 'monthly' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Target Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Assessment Slot</label>
                  <select
                    value={selectedAssessment}
                    onChange={(e) => setSelectedAssessment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="1">Assessment 01 (MCQ / Essay)</option>
                    <option value="2">Assessment 02 (MCQ / Essay)</option>
                  </select>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Term Examination</label>
                <select
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="1">Term 01 Examination</option>
                  <option value="2">Term 02 Examination</option>
                  <option value="3">Term 03 Examination</option>
                  <option value="4">Term 04 Examination</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="ACC">Accounting (ACC)</option>
                <option value="ECON">Economics (ECON)</option>
                <option value="ICT">Information & Communication Technology (ICT)</option>
                <option value="BS">Business Studies (BS)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Marks Table */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm space-y-4 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Student Mark Input Grid</h3>
            <span className="text-xs text-slate-400 font-mono">Max Marks: 100</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-950 text-slate-400 uppercase font-bold text-[11px] tracking-wider border-b border-slate-800">
                  <th className="p-3">Student Name & ID</th>
                  <th className="p-3 w-36">Score (0-100)</th>
                  <th className="p-3 text-center w-24">Calculated Grade</th>
                  <th className="p-3">Teacher / Admin Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {marksGrid.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/40">
                    <td className="p-3">
                      <p className="font-bold text-white text-sm">{row.name}</p>
                      <p className="font-mono text-[11px] text-emerald-400">{row.studentId}</p>
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={row.score}
                        onChange={(e) => handleScoreChange(row.id, e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </td>
                    <td className="p-3 text-center font-bold text-sm">
                      <span className="px-2.5 py-1 rounded bg-slate-800 text-rose-400 border border-slate-700 font-mono">
                        Grade {row.grade || '-'}
                      </span>
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={row.remarks}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMarksGrid(prev => prev.map(item => item.id === row.id ? { ...item, remarks: val } : item));
                        }}
                        placeholder="Optional remarks..."
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg focus:outline-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSaveMarks}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save & Commit Marks to Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

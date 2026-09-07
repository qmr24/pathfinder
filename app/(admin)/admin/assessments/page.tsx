'use client';

import React, { useState } from 'react';
import AdminNavbar from '@/components/layout/AdminNavbar';
import { Edit3, Plus, Link as LinkIcon, CheckCircle2, Trash2 } from 'lucide-react';

export default function AdminAssessmentsPage() {
  const [assessments, setAssessments] = useState([
    { id: '1', title: 'January Assessment 01', month: 'January', number: 1, subject: 'Accounting', formUrl: 'https://forms.google.com/sample1', maxMarks: 100 },
    { id: '2', title: 'January Assessment 02', month: 'January', number: 2, subject: 'Accounting', formUrl: 'https://forms.google.com/sample2', maxMarks: 100 },
    { id: '3', title: 'February Assessment 01', month: 'February', number: 1, subject: 'Economics', formUrl: 'https://forms.google.com/sample3', maxMarks: 100 },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newMonth, setNewMonth] = useState('March');
  const [newNumber, setNewNumber] = useState('1');
  const [newSubject, setNewSubject] = useState('Accounting');
  const [newFormUrl, setNewFormUrl] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAddAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    const item = {
      id: Date.now().toString(),
      title: newTitle || `${newMonth} Assessment 0${newNumber}`,
      month: newMonth,
      number: parseInt(newNumber),
      subject: newSubject,
      formUrl: newFormUrl || 'https://forms.google.com/sample',
      maxMarks: 100
    };
    setAssessments([...assessments, item]);
    setSuccess(true);
    setNewTitle('');
    setNewFormUrl('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Edit3 className="w-7 h-7 text-rose-500" /> Assessment & Google Form Setup
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Register monthly MCQ/Essay assessments and attach Google Forms links for student execution.
          </p>
        </div>

        {success && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> New monthly assessment registered successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Form */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-rose-500" /> Add New Monthly Assessment
            </h3>

            <form onSubmit={handleAddAssessment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assessment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. March Assessment 01 - Costing"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Month</label>
                  <select
                    value={newMonth}
                    onChange={(e) => setNewMonth(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-lg"
                  >
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Slot</label>
                  <select
                    value={newNumber}
                    onChange={(e) => setNewNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-lg"
                  >
                    <option value="1">Assessment 01</option>
                    <option value="2">Assessment 02</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-lg"
                >
                  <option value="Accounting">Accounting</option>
                  <option value="Economics">Economics</option>
                  <option value="ICT">ICT</option>
                  <option value="Business Studies">Business Studies</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Google Form URL</label>
                <input
                  type="url"
                  placeholder="https://docs.google.com/forms/d/e/..."
                  value={newFormUrl}
                  onChange={(e) => setNewFormUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-colors shadow-md mt-2"
              >
                Register Assessment
              </button>
            </form>
          </div>

          {/* Assessment List Table */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="font-bold text-base text-white">Registered Monthly Assessments</h3>

            <div className="space-y-3">
              {assessments.map((ass) => (
                <div key={ass.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-400 text-[10px] font-bold uppercase">
                        {ass.month} #{ass.number}
                      </span>
                      <span className="text-xs font-bold text-white">{ass.subject}</span>
                    </div>
                    <p className="text-sm font-bold text-white">{ass.title}</p>
                    <a
                      href={ass.formUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <LinkIcon className="w-3 h-3" /> {ass.formUrl}
                    </a>
                  </div>

                  <button
                    onClick={() => setAssessments(assessments.filter(a => a.id !== ass.id))}
                    className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

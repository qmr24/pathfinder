'use client';

import React, { useState } from 'react';
import AdminNavbar from '@/components/layout/AdminNavbar';
import { FolderCheck, Plus, Upload, Trash2, CheckCircle2, FileText, Lock, Globe } from 'lucide-react';
import { MOCK_RESOURCES } from '@/lib/mockData';

export default function AdminResourcesPage() {
  const [resourcesList, setResourcesList] = useState(MOCK_RESOURCES);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Accounting');
  const [category, setCategory] = useState('notes');
  const [visibility, setVisibility] = useState('combination');
  const [fileUrl, setFileUrl] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const item = {
      id: Date.now().toString(),
      title,
      description: `Uploaded document for ${subject}`,
      subject_id: '11111111-1111-1111-1111-111111111111',
      category: category as any,
      visibility: visibility as any,
      file_url: fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      storage_provider: 'supabase' as any,
      file_size: '3.1 MB',
      created_at: new Date().toISOString()
    };
    setResourcesList([item, ...resourcesList]);
    setSuccess(true);
    setTitle('');
    setFileUrl('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FolderCheck className="w-7 h-7 text-blue-500" /> Resource & Document Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Upload PDF notes, past papers, and revision documents to the student library.
          </p>
        </div>

        {success && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Document published to student library successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-500" /> Publish New Document
            </h3>

            <form onSubmit={handleUpload} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2025 A/L Accounting Past Paper"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-lg"
                >
                  <option value="Accounting">Accounting</option>
                  <option value="Economics">Economics</option>
                  <option value="ICT">Information & Communication Tech (ICT)</option>
                  <option value="Business Studies">Business Studies</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-lg"
                >
                  <option value="notes">Lecture Notes</option>
                  <option value="past_papers">Past Papers</option>
                  <option value="model_papers">Model Papers</option>
                  <option value="revision">Revision Pack</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Access Visibility</label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-lg"
                >
                  <option value="combination">Subject Enrolled Students Only</option>
                  <option value="students">All Enrolled Students</option>
                  <option value="public">Public (Everyone)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Document URL / PDF Link</label>
                <input
                  type="url"
                  placeholder="Supabase Storage URL or Google Drive link..."
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-md mt-2"
              >
                Publish Document
              </button>
            </form>
          </div>

          {/* Published List */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="font-bold text-base text-white">Active Library Resources</h3>

            <div className="space-y-3">
              {resourcesList.map((res) => (
                <div key={res.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-400 text-[10px] font-bold uppercase">
                        {res.category}
                      </span>
                      {res.visibility === 'public' ? (
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <Globe className="w-3 h-3" /> Public
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Enrolled Students
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-white">{res.title}</p>
                    <p className="text-xs text-slate-400">{res.description}</p>
                  </div>

                  <button
                    onClick={() => setResourcesList(resourcesList.filter(r => r.id !== res.id))}
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

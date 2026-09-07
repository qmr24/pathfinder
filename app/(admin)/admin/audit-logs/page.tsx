'use client';

import React from 'react';
import AdminNavbar from '@/components/layout/AdminNavbar';
import { History, Shield, Clock } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const auditLogs = [
    { id: '1', table: 'monthly_marks', action: 'UPDATE', student: 'Kamal Perera (PF-2026-089)', details: 'Score updated for Jan Assessment 01 (ACC)', oldVal: '72%', newVal: '78%', user: 'Dr. Nimal Senanayake', time: '2026-01-15 14:32:05' },
    { id: '2', table: 'monthly_marks', action: 'INSERT', student: 'Nipuni Silva (PF-2026-092)', details: 'New mark entered for Jan Assessment 01 (ACC)', oldVal: 'N/A', newVal: '84%', user: 'Sunil Rathnayake', time: '2026-01-15 15:10:22' },
    { id: '3', table: 'term_marks', action: 'UPDATE', student: 'Kamal Perera (PF-2026-089)', details: 'Term 01 Accounting Score confirmed', oldVal: '75%', newVal: '78%', user: 'Dr. Nimal Senanayake', time: '2026-04-10 10:15:00' },
    { id: '4', table: 'resources', action: 'INSERT', student: 'All Students', details: 'Uploaded document: 2025 Accounting Past Paper', oldVal: 'N/A', newVal: 'Published', user: 'Kanthi Perera', time: '2026-01-20 09:45:12' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <History className="w-7 h-7 text-amber-500" /> Security Audit Log & Mark History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Immutable system audit trail recording every academic mark change, timestamp, author, and prior values.
          </p>
        </div>

        {/* Audit Trail Table */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-950 text-slate-400 uppercase font-bold text-[11px] tracking-wider border-b border-slate-800">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Action & Table</th>
                  <th className="p-4">Target Student / Item</th>
                  <th className="p-4">Modification Details</th>
                  <th className="p-4 text-center">Previous Value</th>
                  <th className="p-4 text-center">New Value</th>
                  <th className="p-4 text-right">Performed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-medium">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {log.time}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${log.action === 'UPDATE' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'}`}>
                        {log.action}
                      </span>
                      <span className="ml-2 font-mono text-[11px] text-slate-400">{log.table}</span>
                    </td>
                    <td className="p-4 font-bold text-white text-xs">{log.student}</td>
                    <td className="p-4 text-xs text-slate-300">{log.details}</td>
                    <td className="p-4 text-center font-mono text-rose-400 font-bold">{log.oldVal}</td>
                    <td className="p-4 text-center font-mono text-emerald-400 font-bold">{log.newVal}</td>
                    <td className="p-4 text-right font-bold text-slate-200 text-xs">{log.user}</td>
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

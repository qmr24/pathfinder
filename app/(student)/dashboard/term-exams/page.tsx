'use client';

import React from 'react';
import TermExamChart from '@/components/charts/TermExamChart';
import { MOCK_TERM_MARKS } from '@/lib/mockData';
import { getGradeBadgeColor, calculateGrade } from '@/lib/utils';
import { GraduationCap, Award, Table as TableIcon } from 'lucide-react';

export default function TermExamsPage() {
  const thirdSubjectName = "ICT";

  // Matrix Grid Data across Term 1, Term 2, Term 3, Term 4
  const termMatrix = [
    { subject: 'Accounting', code: 'ACC', t1: 78, t2: 82, t3: 85, t4: 88 },
    { subject: 'Economics', code: 'ECON', t1: 81, t2: 79, t3: 87, t4: 90 },
    { subject: 'Information & Communication Technology', code: 'ICT', t1: 89, t2: 91, t3: 88, t4: 93 },
  ];

  // Calculate term averages
  const term1Avg = (78 + 81 + 89) / 3;
  const term2Avg = (82 + 79 + 91) / 3;
  const term3Avg = (85 + 87 + 88) / 3;
  const term4Avg = (88 + 90 + 93) / 3;

  // Chart data for Term Progression
  const termChartData = [
    { term: 'Term 01', Accounting: 78, Economics: 81, 'ICT/BS': 89, Average: parseFloat(term1Avg.toFixed(1)) },
    { term: 'Term 02', Accounting: 82, Economics: 79, 'ICT/BS': 91, Average: parseFloat(term2Avg.toFixed(1)) },
    { term: 'Term 03', Accounting: 85, Economics: 87, 'ICT/BS': 88, Average: parseFloat(term3Avg.toFixed(1)) },
    { term: 'Term 04', Accounting: 88, Economics: 90, 'ICT/BS': 93, Average: parseFloat(term4Avg.toFixed(1)) },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <GraduationCap className="w-7 h-7 text-purple-500" /> Four Term Examinations
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Official annual term exam score matrix, grades, and progression visualization.
        </p>
      </div>

      {/* Term Examination Matrix Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <TableIcon className="w-5 h-5 text-purple-500" /> Term Results Matrix Grid
        </h2>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <th className="p-4">Subject</th>
                  <th className="p-4 text-center">Term 01</th>
                  <th className="p-4 text-center">Term 02</th>
                  <th className="p-4 text-center">Term 03</th>
                  <th className="p-4 text-center">Term 04</th>
                  <th className="p-4 text-right bg-purple-50/60 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 font-extrabold">Subject Average</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {termMatrix.map((row) => {
                  const subjectAvg = ((row.t1 + row.t2 + row.t3 + row.t4) / 4).toFixed(1);
                  return (
                    <tr key={row.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold text-[10px] flex items-center justify-center">
                          {row.code}
                        </span>
                        {row.subject}
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-mono font-semibold text-slate-900 dark:text-white">{row.t1}%</span>
                        <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold border ${getGradeBadgeColor(calculateGrade(row.t1))}`}>
                          {calculateGrade(row.t1)}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-mono font-semibold text-slate-900 dark:text-white">{row.t2}%</span>
                        <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold border ${getGradeBadgeColor(calculateGrade(row.t2))}`}>
                          {calculateGrade(row.t2)}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-mono font-semibold text-slate-900 dark:text-white">{row.t3}%</span>
                        <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold border ${getGradeBadgeColor(calculateGrade(row.t3))}`}>
                          {calculateGrade(row.t3)}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-mono font-semibold text-slate-900 dark:text-white">{row.t4}%</span>
                        <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold border ${getGradeBadgeColor(calculateGrade(row.t4))}`}>
                          {calculateGrade(row.t4)}
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono font-extrabold bg-purple-50/40 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 text-base">
                        {subjectAvg}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100/70 dark:bg-slate-800/70 font-extrabold text-xs text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700">
                  <td className="p-4 uppercase tracking-wider">Overall Term Average</td>
                  <td className="p-4 text-center font-mono text-purple-600 dark:text-purple-400">{term1Avg.toFixed(1)}%</td>
                  <td className="p-4 text-center font-mono text-purple-600 dark:text-purple-400">{term2Avg.toFixed(1)}%</td>
                  <td className="p-4 text-center font-mono text-purple-600 dark:text-purple-400">{term3Avg.toFixed(1)}%</td>
                  <td className="p-4 text-center font-mono text-purple-600 dark:text-purple-400">{term4Avg.toFixed(1)}%</td>
                  <td className="p-4 text-right font-mono text-emerald-600 dark:text-emerald-400 text-base">
                    {((term1Avg + term2Avg + term3Avg + term4Avg) / 4).toFixed(1)}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Term Examination Progression Chart */}
      <TermExamChart data={termChartData} thirdSubjectName={thirdSubjectName} />
    </div>
  );
}

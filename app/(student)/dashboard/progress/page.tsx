'use client';

import React, { useState } from 'react';
import MonthlyProgressChart from '@/components/charts/MonthlyProgressChart';
import SubjectTrendChart from '@/components/charts/SubjectTrendChart';
import { MOCK_STUDENT_PROFILE } from '@/lib/mockData';
import { formatAverage, getGradeBadgeColor } from '@/lib/utils';
import { BarChart3, Filter, Table as TableIcon } from 'lucide-react';

export default function StudentProgressPage() {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('ALL');

  // Interactive Monthly Mark Grid Data
  const monthlyGridData = [
    { month: 'January', ass1: 78, ass2: 84, acc: 78, econ: 82, third: 86 },
    { month: 'February', ass1: 82, ass2: 88, acc: 84, econ: 80, third: 89 },
    { month: 'March', ass1: 91, ass2: 86, acc: 91, econ: 88, third: 85 },
  ];

  // Calculate monthly average
  const formattedMonthlyRows = monthlyGridData.map(row => {
    const monthlyAvg = (row.ass1 + row.ass2) / 2;
    const overallSubjectAvg = (row.acc + row.econ + row.third) / 3;
    return {
      ...row,
      monthlyAvg: monthlyAvg.toFixed(1),
      overallSubjectAvg: overallSubjectAvg.toFixed(1)
    };
  });

  // Recharts Line Graph Data
  const monthlyChartData = formattedMonthlyRows.map(r => ({
    month: r.month,
    assessment1: r.ass1,
    assessment2: r.ass2,
    monthlyAverage: parseFloat(r.monthlyAvg)
  }));

  const subjectTrendData = formattedMonthlyRows.map(r => ({
    period: r.month,
    Accounting: r.acc,
    Economics: r.econ,
    "ICT/BS": r.third
  }));

  const thirdSubjectName = "ICT"; // Determined dynamically from student combination

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-emerald-500" /> My Academic Progress
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Detailed monthly assessment grid, subject breakdown, and visual progress line graphs.
          </p>
        </div>

        {/* Subject Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold overflow-x-auto">
          <span className="px-2.5 text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            onClick={() => setSelectedSubjectFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${selectedSubjectFilter === 'ALL' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
          >
            All Subjects
          </button>
          <button
            onClick={() => setSelectedSubjectFilter('ACC')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${selectedSubjectFilter === 'ACC' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
          >
            Accounting
          </button>
          <button
            onClick={() => setSelectedSubjectFilter('ECON')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${selectedSubjectFilter === 'ECON' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
          >
            Economics
          </button>
          <button
            onClick={() => setSelectedSubjectFilter('THIRD')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${selectedSubjectFilter === 'THIRD' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
          >
            {thirdSubjectName}
          </button>
        </div>
      </div>

      {/* SECTION 1: Monthly Assessment Grid & Line Chart */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TableIcon className="w-5 h-5 text-emerald-500" /> Monthly Assessment Progress Grid
          </h2>
        </div>

        {/* Responsive Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <th className="p-4">Month</th>
                  <th className="p-4 text-right">Assessment 01 (100)</th>
                  <th className="p-4 text-right">Assessment 02 (100)</th>
                  <th className="p-4 text-right bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-extrabold">Monthly Average</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {formattedMonthlyRows.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{row.month}</td>
                    <td className="p-4 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">{row.ass1}%</td>
                    <td className="p-4 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">{row.ass2}%</td>
                    <td className="p-4 text-right font-mono font-extrabold bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-base">
                      {row.monthlyAvg}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visual Line Chart */}
        <MonthlyProgressChart data={monthlyChartData} />
      </section>

      {/* SECTION 2: Subject-wise Breakdown Grid & Trend Chart */}
      <section className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-500" /> Subject-wise Performance Grid
        </h2>

        {/* Responsive Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <th className="p-4">Month</th>
                  <th className="p-4 text-right">Accounting</th>
                  <th className="p-4 text-right">Economics</th>
                  <th className="p-4 text-right">{thirdSubjectName}</th>
                  <th className="p-4 text-right bg-blue-50/60 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-extrabold">Overall Stream Avg</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {formattedMonthlyRows.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{row.month}</td>
                    <td className="p-4 text-right font-mono font-semibold text-blue-600 dark:text-blue-400">{row.acc}%</td>
                    <td className="p-4 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">{row.econ}%</td>
                    <td className="p-4 text-right font-mono font-semibold text-amber-600 dark:text-amber-400">{row.third}%</td>
                    <td className="p-4 text-right font-mono font-extrabold bg-blue-50/40 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-base">
                      {row.overallSubjectAvg}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subject Trend Line Chart */}
        <SubjectTrendChart data={subjectTrendData} thirdSubjectName={thirdSubjectName} />
      </section>
    </div>
  );
}

'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface SubjectTrendData {
  period: string; // e.g. "Jan", "Feb", "Mar"
  Accounting?: number;
  Economics?: number;
  "ICT/BS"?: number;
}

interface Props {
  data: SubjectTrendData[];
  thirdSubjectName: string; // "ICT" or "Business Studies"
}

export default function SubjectTrendChart({ data, thirdSubjectName }: Props) {
  return (
    <div className="w-full h-72 sm:h-80 bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Subject-wise Performance Trend</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Comparing your Commerce stream subjects over time</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="period" stroke="#64748b" fontSize={12} tickLine={false} />
          <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff' }}
            formatter={(value: any) => [`${value}%`, 'Score']}
          />
          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
          <Line 
            type="monotone" 
            dataKey="Accounting" 
            name="Accounting" 
            stroke="#2563eb" 
            strokeWidth={2.5} 
            dot={{ r: 4 }} 
          />
          <Line 
            type="monotone" 
            dataKey="Economics" 
            name="Economics" 
            stroke="#059669" 
            strokeWidth={2.5} 
            dot={{ r: 4 }} 
          />
          <Line 
            type="monotone" 
            dataKey="ICT/BS" 
            name={thirdSubjectName} 
            stroke="#d97706" 
            strokeWidth={2.5} 
            dot={{ r: 4 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

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

interface MonthlyDataPoint {
  month: string;
  assessment1?: number | null;
  assessment2?: number | null;
  monthlyAverage?: number | null;
}

interface Props {
  data: MonthlyDataPoint[];
}

export default function MonthlyProgressChart({ data }: Props) {
  return (
    <div className="w-full h-72 sm:h-80 bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Monthly Assessment Performance</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Score progression across monthly assessments (0-100)</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
          <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff' }}
            formatter={(value: any) => [`${value}%`, 'Mark']}
          />
          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
          <Line 
            type="monotone" 
            dataKey="assessment1" 
            name="Assessment 01" 
            stroke="#3b82f6" 
            strokeWidth={2} 
            dot={{ r: 4 }}
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="monotone" 
            dataKey="assessment2" 
            name="Assessment 02" 
            stroke="#10b981" 
            strokeWidth={2} 
            dot={{ r: 4 }}
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="monotone" 
            dataKey="monthlyAverage" 
            name="Monthly Average" 
            stroke="#8b5cf6" 
            strokeWidth={3} 
            strokeDasharray="4 4"
            dot={{ r: 5 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

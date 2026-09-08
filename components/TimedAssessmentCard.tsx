'use client';

import React, { useState, useEffect } from 'react';
import { Clock, ExternalLink, AlertCircle, CheckCircle2, Lock } from 'lucide-react';

interface AssessmentProps {
  id: string;
  title: string;
  month: string;
  assessmentNumber: number;
  subjectCode: string;
  googleFormUrl: string;
  startTime: string;
  durationMinutes: number; // e.g. 60 minutes
}

export default function TimedAssessmentCard({
  title,
  month,
  assessmentNumber,
  subjectCode,
  googleFormUrl,
  startTime,
  durationMinutes = 60
}: AssessmentProps) {
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const startMs = new Date(startTime).getTime();
      const nowMs = new Date().getTime();
      const endMs = startMs + durationMinutes * 60 * 1000;
      const diffSeconds = Math.floor((endMs - nowMs) / 1000);

      if (diffSeconds <= 0) {
        setTimeLeftSeconds(0);
        setIsExpired(true);
      } else {
        setTimeLeftSeconds(diffSeconds);
        setIsExpired(false);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [startTime, durationMinutes]);

  const formatCountdown = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all shadow-sm space-y-4 ${
      isExpired 
        ? 'bg-slate-100 dark:bg-slate-900/40 border-slate-300 dark:border-slate-800 opacity-80' 
        : 'bg-white dark:bg-slate-900 border-emerald-500/40 hover:border-emerald-500 shadow-emerald-900/10'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase">
            {month} #{assessmentNumber}
          </span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{subjectCode}</span>
        </div>

        {/* 1-Hour Countdown Badge */}
        {isExpired ? (
          <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> 1-Hour Time Limit Expired
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-mono font-bold flex items-center gap-1 animate-pulse">
            <Clock className="w-3.5 h-3.5" /> Time Remaining: {formatCountdown(timeLeftSeconds)}
          </span>
        )}
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Duration: <strong className="text-slate-700 dark:text-slate-300">{durationMinutes} Minutes (Strict Time Limit)</strong>
        </p>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        {isExpired ? (
          <div className="p-3 bg-slate-200 dark:bg-slate-800 rounded-xl text-slate-500 text-xs text-center font-medium flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-slate-400" /> Assessment Closed — 1 Hour Window Passed
          </div>
        ) : (
          <a
            href={googleFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all"
          >
            Start Monthly Assessment <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}

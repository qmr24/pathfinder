"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { MonthlyMark, TermMark, Student } from "@/types";

type Results = {
  student: Student;
  monthlyMarks: MonthlyMark[];
  termMarks: TermMark[];
};

// Returns a colour class based on the mark percentage
function gradeColour(marks: number, max = 100) {
  const pct = (marks / max) * 100;
  if (pct >= 75) return "text-green-600 bg-green-50";
  if (pct >= 55) return "text-blue-600 bg-blue-50";
  if (pct >= 35) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
}

// Groups monthly marks by month name
function monthName(month: number) {
  return new Date(2000, month - 1).toLocaleString("default", { month: "long" });
}

export default function MarksPage() {
  const [nic, setNic]         = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [results, setResults] = useState<Results | null>(null);
  const [tab, setTab]         = useState<"monthly" | "term">("monthly");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!nic.trim()) return;

    setLoading(true);
    setError("");
    setResults(null);

    // 1. Find student by NIC
    const { data: student, error: sErr } = await supabase
      .from("students")
      .select("*")
      .eq("nic", nic.trim())
      .single();

    if (sErr || !student) {
      setError("No student found with that NIC number. Please check and try again.");
      setLoading(false);
      return;
    }

    // 2. Fetch monthly marks with assessment + subject info
    const { data: monthlyMarks } = await supabase
      .from("monthly_marks")
      .select(`
        *,
        assessment:monthly_assessments(*, subject:subjects(*))
      `)
      .eq("student_id", student.id)
      .order("created_at", { ascending: false });

    // 3. Fetch term marks with term exam + subject info
    const { data: termMarks } = await supabase
      .from("term_marks")
      .select(`
        *,
        term_exam:term_examinations(*),
        subject:subjects(*)
      `)
      .eq("student_id", student.id)
      .order("created_at", { ascending: false });

    setResults({
      student,
      monthlyMarks: (monthlyMarks as MonthlyMark[]) ?? [],
      termMarks:    (termMarks    as TermMark[])    ?? [],
    });
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Heading */}
      <div className="mb-10">
        <h1 className="font-display text-4xl text-navy-900 mb-2">Check your marks</h1>
        <p className="text-gray-500">Enter your NIC number to view your results.</p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-10">
        <input
          type="text"
          value={nic}
          onChange={(e) => setNic(e.target.value)}
          placeholder="e.g. 200012345678"
          className="flex-1 border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-navy-800 hover:bg-navy-900 text-white px-6 py-3 rounded text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-5 py-4 text-sm mb-8">
          {error}
        </div>
      )}

      {/* Results */}
      {results && (
        <div>
          {/* Student info banner */}
          <div className="bg-navy-900 text-white rounded-lg px-6 py-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-display text-xl">{results.student.full_name}</p>
              <p className="text-navy-300 text-sm mt-1">
                NIC: {results.student.nic} · {results.student.school ?? "Pathfinder"} · A/L {results.student.al_year}
              </p>
            </div>
            <span className="bg-gold-500 text-navy-900 text-xs font-semibold px-3 py-1 rounded self-start sm:self-center">
              Results found
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 border-b border-gray-200">
            {(["monthly", "term"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  tab === t
                    ? "border-navy-700 text-navy-900"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                }`}
              >
                {t === "monthly" ? "Monthly Assessments" : "Term Examinations"}
              </button>
            ))}
          </div>

          {/* Monthly marks tab */}
          {tab === "monthly" && (
            <div>
              {results.monthlyMarks.length === 0 ? (
                <p className="text-gray-400 text-sm py-8 text-center">No monthly marks published yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                      <tr>
                        <th className="px-5 py-3 text-left">Assessment</th>
                        <th className="px-5 py-3 text-left">Subject</th>
                        <th className="px-5 py-3 text-left">Month</th>
                        <th className="px-5 py-3 text-center">Marks</th>
                        <th className="px-5 py-3 text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {results.monthlyMarks.map((m) => (
                        <tr key={m.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4 font-medium text-navy-800">
                            {m.assessment?.title ?? "—"}
                          </td>
                          <td className="px-5 py-4 text-gray-600">
                            {m.assessment?.subject?.code ?? "—"}
                          </td>
                          <td className="px-5 py-4 text-gray-600">
                            {m.assessment ? monthName(m.assessment.month) : "—"}
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${gradeColour(m.marks_obtained, m.assessment?.max_marks)}`}>
                              {m.marks_obtained} / {m.assessment?.max_marks ?? 100}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center font-semibold text-navy-700">
                            {m.grade ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Term marks tab */}
          {tab === "term" && (
            <div>
              {results.termMarks.length === 0 ? (
                <p className="text-gray-400 text-sm py-8 text-center">No term exam marks published yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                      <tr>
                        <th className="px-5 py-3 text-left">Examination</th>
                        <th className="px-5 py-3 text-left">Subject</th>
                        <th className="px-5 py-3 text-center">Marks</th>
                        <th className="px-5 py-3 text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {results.termMarks.map((m) => (
                        <tr key={m.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4 font-medium text-navy-800">
                            {m.term_exam?.title ?? "—"}
                          </td>
                          <td className="px-5 py-4 text-gray-600">
                            {m.subject?.code ?? "—"} — {m.subject?.name ?? ""}
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${gradeColour(m.marks_obtained)}`}>
                              {m.marks_obtained} / 100
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center font-semibold text-navy-700">
                            {m.grade ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

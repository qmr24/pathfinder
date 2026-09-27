"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Resource, Subject } from "@/types";

const CATEGORIES = [
  { key: "all",          label: "All" },
  { key: "notes",        label: "Notes" },
  { key: "past_papers",  label: "Past Papers" },
  { key: "model_papers", label: "Model Papers" },
  { key: "revision",     label: "Revision" },
  { key: "other",        label: "Other" },
];

const CATEGORY_COLOURS: Record<string, string> = {
  notes:        "bg-blue-50 text-blue-700",
  past_papers:  "bg-purple-50 text-purple-700",
  model_papers: "bg-green-50 text-green-700",
  revision:     "bg-yellow-50 text-yellow-700",
  other:        "bg-gray-100 text-gray-600",
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [subjects,  setSubjects]  = useState<Subject[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [category,  setCategory]  = useState("all");
  const [subject,   setSubject]   = useState("all");

  useEffect(() => {
    async function load() {
      const [{ data: res }, { data: subs }] = await Promise.all([
        supabase.from("resources").select("*, subject:subjects(*)").order("created_at", { ascending: false }),
        supabase.from("subjects").select("*").order("code"),
      ]);
      setResources((res as Resource[]) ?? []);
      setSubjects((subs  as Subject[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = resources.filter((r) => {
    const catMatch = category === "all" || r.category === category;
    const subMatch = subject  === "all" || r.subject_id === subject;
    return catMatch && subMatch;
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Heading */}
      <div className="mb-10">
        <h1 className="font-display text-4xl text-navy-900 mb-2">Study Resources</h1>
        <p className="text-gray-500">Notes, past papers, and revision materials — free for everyone.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              category === c.key
                ? "bg-navy-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        <button
          onClick={() => setSubject("all")}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            subject === "all"
              ? "bg-navy-800 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All Subjects
        </button>
        {subjects.map((s) => (
          <button
            key={s.id}
            onClick={() => setSubject(s.id)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              subject === s.id
                ? "bg-navy-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s.code}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16 text-gray-400 text-sm">Loading resources…</div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm">
          No resources found for the selected filters.
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r) => (
            <div key={r.id} className="border border-gray-200 rounded-lg p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow">
              {/* Category + subject badges */}
              <div className="flex gap-2 flex-wrap">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${CATEGORY_COLOURS[r.category]}`}>
                  {r.category.replace("_", " ")}
                </span>
                {r.subject && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-navy-50 text-navy-700">
                    {r.subject.code}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-navy-900 leading-snug mb-1">{r.title}</h3>
                {r.description && (
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{r.description}</p>
                )}
              </div>

              {/* Download link */}
              <a
                href={r.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-navy-700 hover:text-navy-900 transition-colors mt-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
                {r.file_size && <span className="text-gray-400 font-normal">· {r.file_size}</span>}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

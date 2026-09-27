export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-navy-900 mb-4">About Pathfinder</h1>
      <p className="text-gray-500 text-lg mb-10 leading-relaxed">
        Pathfinder is a results and resources platform for G.C.E. A/L Commerce students in Sri Lanka.
      </p>

      <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-5">
        <p>
          We publish monthly assessment results and term examination marks so students can track
          their progress without any login or registration. Enter your NIC number and your results
          appear instantly.
        </p>
        <p>
          Our resource library is open to everyone — no account needed. Download notes, past papers,
          model papers, and revision materials across Accounting, Economics, ICT, and Business Studies.
        </p>
        <p>
          Pathfinder is built and maintained to support A/L students preparing for the Sri Lankan
          G.C.E. Advanced Level examination.
        </p>
      </div>

      {/* Subjects */}
      <div className="mt-14">
        <h2 className="font-display text-2xl text-navy-900 mb-6">Subjects covered</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { code: "ACC",  name: "Accounting" },
            { code: "ECON", name: "Economics" },
            { code: "ICT",  name: "Information & Communication Technology" },
            { code: "BS",   name: "Business Studies" },
          ].map((s) => (
            <div key={s.code} className="flex items-center gap-4 border border-gray-200 rounded-lg px-5 py-4">
              <span className="bg-navy-900 text-white text-xs font-bold px-2 py-1 rounded">
                {s.code}
              </span>
              <span className="text-gray-700 text-sm">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

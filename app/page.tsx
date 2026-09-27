import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-navy-900 text-white py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gold-400 text-sm font-medium tracking-widest uppercase mb-4">
            Sri Lankan G.C.E. A/L Commerce
          </p>
          <h1 className="font-display text-5xl md:text-6xl leading-tight mb-6">
            Your results.<br />Your resources.
          </h1>
          <p className="text-navy-300 text-lg mb-10 max-w-xl mx-auto">
            Enter your NIC number to instantly view your monthly assessment
            and term examination marks. No login needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/marks"
              className="bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold px-8 py-3 rounded transition-colors"
            >
              Check my marks
            </Link>
            <Link
              href="/resources"
              className="border border-navy-500 hover:border-white text-white px-8 py-3 rounded transition-colors"
            >
              Browse resources
            </Link>
          </div>
        </div>
      </section>

      {/* Quick info cards */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="border border-gray-100 rounded-lg p-8">
            <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Monthly Assessments</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Two assessments per month per subject. Track your performance across Accounting, Economics, ICT and Business Studies.
            </p>
          </div>

          <div className="border border-gray-100 rounded-lg p-8">
            <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Term Examinations</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              View your term exam results across all 4 terms. See grades and subject-wise breakdowns at a glance.
            </p>
          </div>

          <div className="border border-gray-100 rounded-lg p-8">
            <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Study Resources</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Free access to notes, past papers, model papers and revision materials for all subjects.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-50 py-16 px-6 text-center">
        <h2 className="font-display text-3xl text-navy-900 mb-3">Ready to check your results?</h2>
        <p className="text-gray-500 mb-8">All you need is your NIC number.</p>
        <Link
          href="/marks"
          className="bg-navy-800 hover:bg-navy-900 text-white font-semibold px-8 py-3 rounded transition-colors"
        >
          Check my marks
        </Link>
      </section>
    </div>
  );
}

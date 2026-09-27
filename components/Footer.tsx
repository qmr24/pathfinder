import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-navy-300 mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <p className="font-display text-white text-lg mb-1">Pathfinder</p>
          <p className="text-sm">A/L Results & Study Resources</p>
        </div>
        <div className="flex gap-8 text-sm">
          <Link href="/marks"     className="hover:text-white transition-colors">Check Marks</Link>
          <Link href="/resources" className="hover:text-white transition-colors">Resources</Link>
          <Link href="/about"     className="hover:text-white transition-colors">About</Link>
          <Link href="/contact"   className="hover:text-white transition-colors">Contact</Link>
        </div>
      </div>
      <div className="border-t border-navy-800 text-center py-4 text-xs text-navy-500">
        © {new Date().getFullYear()} Pathfinder. All rights reserved.
      </div>
    </footer>
  );
}

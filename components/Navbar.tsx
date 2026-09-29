"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/marks", label: "Check Marks" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <nav className="bg-navy-900 text-white">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          onClick={closeMenu}
          className="font-display text-xl text-gold-400 tracking-tight"
        >
          Pathfinder
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "text-sm transition-colors",
                  active
                    ? "text-gold-400 font-medium"
                    : "text-navy-200 hover:text-white",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          className="md:hidden text-navy-200 hover:text-white"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div
          id="mobile-navigation"
          className="md:hidden border-t border-navy-700 px-6 py-4 flex flex-col gap-2"
        >
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "rounded px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-navy-800 text-gold-400 font-medium"
                    : "text-navy-200 hover:bg-navy-800 hover:text-white",
                ].join(" ")}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}

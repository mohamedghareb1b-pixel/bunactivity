"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const LINKS = [
  { href: "/concerts", label: "Concerts" },
  { href: "/artists", label: "Artists" },
  { href: "/cities", label: "Cities" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Open menu"
        className="p-2 -mr-2"
      >
        {/* Simple 3-line hamburger icon, drawn with CSS so no icon library is needed */}
        <span className="block w-6 h-0.5 bg-current mb-1.5" />
        <span className="block w-6 h-0.5 bg-current mb-1.5" />
        <span className="block w-6 h-0.5 bg-current" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-44 card p-2 space-y-1 shadow-lg z-20"
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm rounded hover:opacity-80"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
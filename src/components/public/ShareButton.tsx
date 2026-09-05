"use client";

import { useState, useRef, useEffect } from "react";

export default function ShareButton({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — fail silently, other share options still work
    }
  }

  const emailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
    `Check this out: ${title}\n${url}`
  )}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Share this event"
        className="px-3 py-2 text-sm rounded border"
      >
        Share
      </button>

      {open && (
        <div
          role="menu"
          className="absolute z-10 mt-2 w-44 card p-2 space-y-1 shadow-lg"
        >
          <a
            href={emailHref}
            role="menuitem"
            className="block px-3 py-2 text-sm rounded hover:opacity-80"
          >
            Email
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            className="block px-3 py-2 text-sm rounded hover:opacity-80"
          >
            WhatsApp
          </a>
          <button
            type="button"
            onClick={handleCopy}
            role="menuitem"
            className="w-full text-left px-3 py-2 text-sm rounded hover:opacity-80"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      )}
    </div>
  );
}
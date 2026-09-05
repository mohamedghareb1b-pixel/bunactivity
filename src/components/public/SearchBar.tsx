"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({
  placeholder = "Search artists, concerts, cities or venues",
  initialValue = "",
}: {
  placeholder?: string;
  initialValue?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto flex gap-2">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-full border px-4 py-2"
      />
      <button type="submit" className="btn-primary px-5 py-2 shrink-0">
        Search
      </button>
    </form>
  );
}
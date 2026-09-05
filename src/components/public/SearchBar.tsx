"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({
  placeholder = "Search artists, cities or events",
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
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto flex gap-2">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-full border px-4 py-2"
      />
      <button type="submit" className="btn-primary px-5 py-2">
        Search
      </button>
    </form>
  );
}

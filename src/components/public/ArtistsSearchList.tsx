"use client";

import { useState, useMemo } from "react";
import ArtistCard from "@/components/public/ArtistCard";

interface ArtistItem {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  nextEvent: { city?: string | null; date: Date } | null;
}

export default function ArtistsSearchList({ artists }: { artists: ArtistItem[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return artists;
    return artists.filter((a) => a.name.toLowerCase().includes(q));
  }, [artists, query]);

  return (
    <div>
      <div className="mb-6 max-w-sm">
        <label htmlFor="artist-search" className="sr-only">
          Search artists by name
        </label>
        <input
          id="artist-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search artists by name"
          className="w-full min-w-0 rounded-full border px-4 py-2 text-sm"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {filtered.map((a) => (
            <ArtistCard
              key={a.id}
              slug={a.slug}
              name={a.name}
              image={a.image}
              nextEvent={a.nextEvent}
            />
          ))}
        </div>
      ) : (
        <p className="opacity-70">No artists match &quot;{query}&quot;.</p>
      )}
    </div>
  );
}
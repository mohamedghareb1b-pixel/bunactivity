"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DATE_FILTER_OPTIONS } from "@/lib/date-filters";

interface FilterOption {
  value: string;
  label: string;
}

export default function ConcertsFilterBar({
  cities,
  artists,
}: {
  cities: FilterOption[];
  artists: FilterOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key === "date" && value !== "custom") {
      params.delete("from");
      params.delete("to");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const currentDate = searchParams.get("date") ?? "";
  const currentCity = searchParams.get("city") ?? "";
  const currentArtist = searchParams.get("artist") ?? "";

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <select
        value={currentDate}
        onChange={(e) => updateParam("date", e.target.value)}
        className="rounded border px-3 py-2 text-sm"
      >
        <option value="">Any Date</option>
        {DATE_FILTER_OPTIONS.map((opt) => (
          <option key={opt.key} value={opt.key}>
            {opt.label}
          </option>
        ))}
      </select>

      {currentDate === "custom" && (
        <>
          <input
            type="date"
            value={searchParams.get("from") ?? ""}
            onChange={(e) => updateParam("from", e.target.value)}
            className="rounded border px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={searchParams.get("to") ?? ""}
            onChange={(e) => updateParam("to", e.target.value)}
            className="rounded border px-3 py-2 text-sm"
          />
        </>
      )}

      <select
        value={currentCity}
        onChange={(e) => updateParam("city", e.target.value)}
        className="rounded border px-3 py-2 text-sm"
      >
        <option value="">Any City</option>
        {cities.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      <select
        value={currentArtist}
        onChange={(e) => updateParam("artist", e.target.value)}
        className="rounded border px-3 py-2 text-sm"
      >
        <option value="">Any Artist</option>
        {artists.map((a) => (
          <option key={a.value} value={a.value}>
            {a.label}
          </option>
        ))}
      </select>

      {(currentDate || currentCity || currentArtist) && (
        <button
          onClick={() => router.push(pathname)}
          className="text-sm underline opacity-70"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

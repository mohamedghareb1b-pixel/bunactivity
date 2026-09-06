"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

interface ArtistOption {
  id: string;
  name: string;
}

interface EventFormValues {
  id?: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  date: string; // yyyy-mm-dd
  time?: string;
  timezone?: string;
  venueName?: string;
  city?: string;
  state?: string;
  country?: string;
  ticketUrl: string;
  affiliateProvider?: string;
  seoTitle?: string;
  seoDescription?: string;
  featured: boolean;
  publishStatus: "DRAFT" | "PUBLISHED";
  artistIds: string[];
}

export default function EventForm({
  artistOptions,
  initialValues,
}: {
  artistOptions: ArtistOption[];
  initialValues?: EventFormValues;
}) {
  const router = useRouter();
  const isEditing = Boolean(initialValues?.id);

  const [values, setValues] = useState<EventFormValues>(
    initialValues ?? {
      name: "",
      slug: "",
      date: "",
      ticketUrl: "",
      featured: false,
      publishStatus: "DRAFT",
      artistIds: [],
    }
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [artistSearch, setArtistSearch] = useState("");

  const filteredArtists = useMemo(() => {
    const q = artistSearch.trim().toLowerCase();
    if (!q) return artistOptions;
    return artistOptions.filter((a) => a.name.toLowerCase().includes(q));
  }, [artistOptions, artistSearch]);

  const selectedArtists = useMemo(
    () => artistOptions.filter((a) => values.artistIds.includes(a.id)),
    [artistOptions, values.artistIds]
  );

  function update<K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function toggleArtist(id: string) {
    setValues((v) => ({
      ...v,
      artistIds: v.artistIds.includes(id)
        ? v.artistIds.filter((a) => a !== id)
        : [...v.artistIds, id],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url = isEditing ? `/api/admin/events/${values.id}` : "/api/admin/events";
    const method = isEditing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Save failed");
      return;
    }

    router.push("/admin/events");
    router.refresh();
  }

  async function handleDelete() {
    if (!values.id) return;
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/admin/events/${values.id}`, { method: "DELETE" });
    router.push("/admin/events");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium mb-1">Event Name</label>
        <input
          required
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Slug</label>
        <input
          required
          value={values.slug}
          onChange={(e) => update("slug", e.target.value)}
          className="w-full rounded border px-3 py-2"
          placeholder="summer-night-live-new-york"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <input
          value={values.image ?? ""}
          onChange={(e) => update("image", e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={values.description ?? ""}
          onChange={(e) => update("description", e.target.value)}
          className="w-full rounded border px-3 py-2"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            required
            value={values.date}
            onChange={(e) => update("date", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Time</label>
          <input
            type="time"
            value={values.time ?? ""}
            onChange={(e) => update("time", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Timezone</label>
        <input
          value={values.timezone ?? ""}
          onChange={(e) => update("timezone", e.target.value)}
          className="w-full rounded border px-3 py-2"
          placeholder="America/New_York"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Venue Name</label>
        <input
          value={values.venueName ?? ""}
          onChange={(e) => update("venueName", e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            value={values.city ?? ""}
            onChange={(e) => update("city", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <input
            value={values.state ?? ""}
            onChange={(e) => update("state", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <input
            value={values.country ?? "US"}
            onChange={(e) => update("country", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Ticket / Affiliate URL</label>
        <input
          required
          value={values.ticketUrl}
          onChange={(e) => update("ticketUrl", e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Affiliate Provider</label>
        <input
          value={values.affiliateProvider ?? ""}
          onChange={(e) => update("affiliateProvider", e.target.value)}
          className="w-full rounded border px-3 py-2"
          placeholder="TicketNetwork"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Artists (search and select)</label>

        {selectedArtists.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedArtists.map((a) => (
              <span
                key={a.id}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full card"
              >
                {a.name}
                <button
                  type="button"
                  onClick={() => toggleArtist(a.id)}
                  aria-label={`Remove ${a.name}`}
                  className="opacity-60 hover:opacity-100"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <input
          type="search"
          value={artistSearch}
          onChange={(e) => setArtistSearch(e.target.value)}
          placeholder="Search artists by name"
          className="w-full min-w-0 rounded border px-3 py-2 text-sm mb-2"
        />

        <div className="max-h-48 overflow-y-auto border rounded p-3 space-y-1">
          {filteredArtists.length > 0 ? (
            filteredArtists.map((a) => (
              <label key={a.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={values.artistIds.includes(a.id)}
                  onChange={() => toggleArtist(a.id)}
                />
                {a.name}
              </label>
            ))
          ) : (
            <p className="text-sm opacity-60">No artists match &quot;{artistSearch}&quot;.</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">SEO Title</label>
        <input
          value={values.seoTitle ?? ""}
          onChange={(e) => update("seoTitle", e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">SEO Description</label>
        <textarea
          value={values.seoDescription ?? ""}
          onChange={(e) => update("seoDescription", e.target.value)}
          className="w-full rounded border px-3 py-2"
          rows={2}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={values.featured}
          onChange={(e) => update("featured", e.target.checked)}
          id="featured"
        />
        <label htmlFor="featured">Featured</label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Publish Status</label>
        <select
          value={values.publishStatus}
          onChange={(e) => update("publishStatus", e.target.value as "DRAFT" | "PUBLISHED")}
          className="w-full rounded border px-3 py-2"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary px-6 py-2">
          {saving ? "Saving..." : "Save"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-6 py-2 rounded border border-red-600 text-red-600"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
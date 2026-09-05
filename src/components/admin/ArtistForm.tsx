"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ArtistFormValues {
  id?: string;
  name: string;
  slug: string;
  image?: string;
  shortBio?: string;
  biography?: string;
  genre?: string;
  tiktokUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  featured: boolean;
  status: "DRAFT" | "PUBLISHED";
}

export default function ArtistForm({
  initialValues,
}: {
  initialValues?: ArtistFormValues;
}) {
  const router = useRouter();
  const isEditing = Boolean(initialValues?.id);

  const [values, setValues] = useState<ArtistFormValues>(
    initialValues ?? {
      name: "",
      slug: "",
      featured: false,
      status: "DRAFT",
    }
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof ArtistFormValues>(key: K, value: ArtistFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url = isEditing ? `/api/admin/artists/${values.id}` : "/api/admin/artists";
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

    router.push("/admin/artists");
    router.refresh();
  }

  async function handleDelete() {
    if (!values.id) return;
    if (!confirm("Delete this artist?")) return;
    await fetch(`/api/admin/artists/${values.id}`, { method: "DELETE" });
    router.push("/admin/artists");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
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
          placeholder="taylor-swift"
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
        <label className="block text-sm font-medium mb-1">Short Bio</label>
        <textarea
          value={values.shortBio ?? ""}
          onChange={(e) => update("shortBio", e.target.value)}
          className="w-full rounded border px-3 py-2"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Full Biography</label>
        <textarea
          value={values.biography ?? ""}
          onChange={(e) => update("biography", e.target.value)}
          className="w-full rounded border px-3 py-2"
          rows={5}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Genre</label>
        <input
          value={values.genre ?? ""}
          onChange={(e) => update("genre", e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">TikTok URL</label>
        <input
          value={values.tiktokUrl ?? ""}
          onChange={(e) => update("tiktokUrl", e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
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
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={values.status}
          onChange={(e) => update("status", e.target.value as "DRAFT" | "PUBLISHED")}
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

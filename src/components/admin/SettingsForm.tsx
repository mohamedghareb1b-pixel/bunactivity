"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SettingsFormValues {
  siteTitle: string;
  siteDescription?: string;
  siteUrl?: string;
  defaultOgImage?: string;
  googleVerification?: string;
  analyticsId?: string;
  tagManagerId?: string;
  tiktokUrl?: string;
  affiliateDisclosure?: string;
  defaultAffiliateProvider?: string;
}

export default function SettingsForm({ initialValues }: { initialValues: SettingsFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<SettingsFormValues>(initialValues);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof SettingsFormValues>(key: K, value: SettingsFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Save failed");
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-xl">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">General SEO</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Site Title</label>
          <input
            required
            value={values.siteTitle}
            onChange={(e) => update("siteTitle", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Site Description</label>
          <textarea
            value={values.siteDescription ?? ""}
            onChange={(e) => update("siteDescription", e.target.value)}
            className="w-full rounded border px-3 py-2"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Site URL</label>
          <input
            value={values.siteUrl ?? ""}
            onChange={(e) => update("siteUrl", e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="https://bunactivity.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Default OG Image URL</label>
          <input
            value={values.defaultOgImage ?? ""}
            onChange={(e) => update("defaultOgImage", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Google</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Search Console Verification</label>
          <input
            value={values.googleVerification ?? ""}
            onChange={(e) => update("googleVerification", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Analytics ID</label>
          <input
            value={values.analyticsId ?? ""}
            onChange={(e) => update("analyticsId", e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="G-XXXXXXX"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tag Manager ID</label>
          <input
            value={values.tagManagerId ?? ""}
            onChange={(e) => update("tagManagerId", e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="GTM-XXXXXXX"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Social</h2>
        <div>
          <label className="block text-sm font-medium mb-1">TikTok URL</label>
          <input
            value={values.tiktokUrl ?? ""}
            onChange={(e) => update("tiktokUrl", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Affiliate</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Affiliate Disclosure Text</label>
          <textarea
            value={values.affiliateDisclosure ?? ""}
            onChange={(e) => update("affiliateDisclosure", e.target.value)}
            className="w-full rounded border px-3 py-2"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Default Affiliate Provider</label>
          <input
            value={values.defaultAffiliateProvider ?? ""}
            onChange={(e) => update("defaultAffiliateProvider", e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="TicketNetwork"
          />
        </div>
      </section>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {saved && <p className="text-green-700 text-sm">Saved.</p>}

      <button type="submit" disabled={saving} className="btn-primary px-6 py-2">
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}

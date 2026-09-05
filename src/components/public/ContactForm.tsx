"use client";

import { useState } from "react";

export default function ContactForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    company: "", // honeypot — hidden from real users via CSS
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof values>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please try again.");
      setStatus("error");
      return;
    }

    setStatus("sent");
    setValues({ name: "", email: "", subject: "", message: "", company: "" });
  }

  if (status === "sent") {
    return (
      <div role="status" className="card p-6 text-center">
        <p className="font-semibold">Thanks — your message has been sent.</p>
        <p className="text-sm opacity-70 mt-1">
          We typically respond within 2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Honeypot field: hidden from sighted users and skipped by keyboard tab order,
          but visible to most basic bots that fill every field */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(e) => update("company", e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-1">
          Subject <span className="opacity-60 font-normal">(optional)</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          value={values.subject}
          onChange={(e) => update("subject", e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      {error && (
        <p role="alert" className="text-red-600 text-sm">
          {error}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-primary px-6 py-2">
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
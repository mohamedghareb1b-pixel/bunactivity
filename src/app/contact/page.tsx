import ContactForm from "@/components/public/ContactForm";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with BunActivity — ask a question, report an issue with an event or artist page, or reach out about artist and management requests.",
};

export default function ContactPage() {
  return (
    <main className="px-6 py-16 max-w-2xl mx-auto space-y-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact BunActivity",
          url: "https://bunactivity.com/contact",
          about: {
            "@type": "Organization",
            name: "BunActivity",
          },
        }}
      />

      <header>
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="mt-2 opacity-80">
          Have a question, spotted an error on an event or artist page, or represent an
          artist or venue? Send us a message below — we&apos;re a real, small team
          behind BunActivity and typically respond within 2 business days.
        </p>
      </header>

      <section aria-labelledby="contact-form-heading">
        <h2 id="contact-form-heading" className="sr-only">
          Contact form
        </h2>
        <ContactForm />
      </section>

      <section aria-labelledby="other-ways-heading" className="space-y-3">
        <h2 id="other-ways-heading" className="text-xl font-semibold">
          Other Ways to Reach Us
        </h2>
        <p className="text-sm opacity-70">
          BunActivity is run by a small, real team dedicated to helping people
          discover live events across the U.S.
        </p>
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="opacity-60">Event corrections</dt>
            <dd>
              <a href="mailto:corrections@bunactivity.com" className="underline">
                corrections@bunactivity.com
              </a>
            </dd>
          </div>
          <div>
            <dt className="opacity-60">Artist / management requests</dt>
            <dd>
              <a href="mailto:artists@bunactivity.com" className="underline">
                artists@bunactivity.com
              </a>
            </dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
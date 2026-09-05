import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How BunActivity collects, uses, and protects information when you browse concerts, artists, and events on our site.",
};

const LAST_UPDATED = "September 4, 2026";

export default function PrivacyPage() {
  return (
    <main className="px-6 py-16 max-w-2xl mx-auto space-y-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Privacy Policy",
          url: "https://bunactivity.com/privacy",
          dateModified: LAST_UPDATED,
          isPartOf: { "@type": "WebSite", name: "BunActivity" },
        }}
      />

      <header>
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-sm opacity-60 mt-1">Last updated: {LAST_UPDATED}</p>
      </header>

      <p>
        This Privacy Policy explains what information BunActivity
        (&quot;BunActivity&quot;, &quot;we&quot;, &quot;us&quot;) collects when you use
        this site, how we use it, and the choices you have. BunActivity does not
        require an account, and we collect as little personal information as possible.
      </p>

      <section id="information-we-collect" className="space-y-2">
        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <p>We collect information in two ways:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Information you provide directly</strong> — for example, your name,
            email address, and message when you submit our{" "}
            <Link href="/contact" className="underline">
              Contact form
            </Link>
            .
          </li>
          <li>
            <strong>Information collected automatically</strong> — such as pages
            visited, browser type, device type, and general location (city/country
            level), gathered through analytics tools when enabled.
          </li>
        </ul>
        <p>
          We do not collect payment information. Ticket purchases happen entirely on
          our ticketing partners&apos; websites, not on BunActivity.
        </p>
      </section>

      <section id="how-we-use-it" className="space-y-2">
        <h2 className="text-xl font-semibold">2. How We Use This Information</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>To respond to messages sent through our Contact form</li>
          <li>To understand how visitors use the site and improve it</li>
          <li>To measure which pages, artists, and events attract the most interest</li>
          <li>To detect and prevent spam or abuse of our forms</li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>
      </section>

      <section id="cookies" className="space-y-2">
        <h2 className="text-xl font-semibold">3. Cookies &amp; Analytics</h2>
        <p>
          We may use cookies and similar technologies (such as Google Analytics or
          Google Tag Manager, if enabled) to understand site usage. These tools may set
          cookies in your browser to distinguish visitors and measure activity. You can
          disable cookies in your browser settings; the site will still work, though
          some features may be affected.
        </p>
      </section>

      <section id="affiliate-tracking" className="space-y-2">
        <h2 className="text-xl font-semibold">4. Affiliate Links &amp; Ticketing Partners</h2>
        <p>
          When you select &quot;Get Tickets&quot; on an event page, you are redirected
          to a third-party ticketing partner. That partner may set its own cookies and
          collect information according to its own privacy policy, which we do not
          control. We recommend reviewing the ticketing partner&apos;s privacy policy
          before completing a purchase. See our{" "}
          <Link href="/affiliate-disclosure" className="underline">
            Affiliate Disclosure
          </Link>{" "}
          for more on how these links work.
        </p>
      </section>

      <section id="sharing" className="space-y-2">
        <h2 className="text-xl font-semibold">5. Who We Share Information With</h2>
        <p>We may share limited information with:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Analytics providers (e.g. Google Analytics), to understand site usage</li>
          <li>Service providers who help us operate the site (e.g. hosting, database)</li>
          <li>Legal authorities, if required by law</li>
        </ul>
        <p>We do not share your Contact form submissions with third parties for marketing purposes.</p>
      </section>

      <section id="data-retention" className="space-y-2">
        <h2 className="text-xl font-semibold">6. Data Retention</h2>
        <p>
          We retain Contact form submissions for as long as needed to respond to your
          inquiry and for a reasonable period afterward for record-keeping. Analytics
          data is retained according to the analytics provider&apos;s own retention
          settings.
        </p>
      </section>

      <section id="your-choices" className="space-y-2">
        <h2 className="text-xl font-semibold">7. Your Choices</h2>
        <p>
          You can browse BunActivity without providing any personal information. If
          you&apos;ve contacted us and want your message deleted from our records, or
          have any other privacy question, reach out via our{" "}
          <Link href="/contact" className="underline">
            Contact page
          </Link>
          .
        </p>
      </section>

      <section id="childrens-privacy" className="space-y-2">
        <h2 className="text-xl font-semibold">8. Children&apos;s Privacy</h2>
        <p>
          BunActivity is not directed at children under 13, and we do not knowingly
          collect personal information from children under 13.
        </p>
      </section>

      <section id="changes" className="space-y-2">
        <h2 className="text-xl font-semibold">9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. The &quot;Last
          updated&quot; date at the top of this page reflects the most recent changes.
        </p>
      </section>

      <section id="contact" className="space-y-2">
        <h2 className="text-xl font-semibold">10. Contact Us</h2>
        <p>
          Questions about this Privacy Policy? Reach out via our{" "}
          <Link href="/contact" className="underline">
            Contact page
          </Link>
          .
        </p>
      </section>
    </main>
  );
}

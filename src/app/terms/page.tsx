import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  title: "Terms of Use",
  description:
    "The terms and conditions for using BunActivity to discover concerts, artists, and events, and to access ticket purchase links from our partners.",
};

const LAST_UPDATED = "September 4, 2026";

export default function TermsPage() {
  return (
    <main className="px-6 py-16 max-w-2xl mx-auto space-y-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Terms of Use",
          url: "https://bunactivity.com/terms",
          dateModified: LAST_UPDATED,
          isPartOf: { "@type": "WebSite", name: "BunActivity" },
        }}
      />

      <header>
        <h1 className="text-3xl font-bold">Terms of Use</h1>
        <p className="text-sm opacity-60 mt-1">Last updated: {LAST_UPDATED}</p>
      </header>

      <p>
        These Terms of Use (&quot;Terms&quot;) govern your use of BunActivity
        (&quot;BunActivity&quot;, &quot;we&quot;, &quot;us&quot;), a website that helps
        you discover concerts, artists, and live events in the United States. By using
        this site, you agree to these Terms. If you do not agree, please do not use the
        site.
      </p>

      <section id="what-we-do" className="space-y-2">
        <h2 className="text-xl font-semibold">1. What BunActivity Does</h2>
        <p>
          BunActivity is a discovery platform. We publish information about concerts,
          artists, venues, and event dates so you can find events that interest you. We
          do not sell tickets directly, and we do not process ticket payments.
        </p>
        <p>
          When you select &quot;Get Tickets&quot; on an event page, we redirect you to a
          third-party ticketing partner&apos;s website to complete your purchase. That
          transaction is between you and the ticketing partner, not BunActivity.
        </p>
      </section>

      <section id="account" className="space-y-2">
        <h2 className="text-xl font-semibold">2. No Account Required</h2>
        <p>
          BunActivity does not require you to register or create an account to browse
          the site.
        </p>
      </section>

      <section id="accuracy" className="space-y-2">
        <h2 className="text-xl font-semibold">3. Accuracy of Event Information</h2>
        <p>
          We make a reasonable effort to keep event names, dates, times, venues, and
          artist lineups accurate and up to date. However, this information is supplied
          by third parties and can change without notice. BunActivity does not
          guarantee that any event listed will occur as described, and we recommend
          verifying details directly with the ticketing partner or venue before making
          plans.
        </p>
      </section>

      <section id="tickets-pricing" className="space-y-2">
        <h2 className="text-xl font-semibold">4. Ticket Pricing and Availability</h2>
        <p>
          Ticket prices, fees, and availability are set and controlled by our ticketing
          partners, not by BunActivity. Prices shown or implied on BunActivity may
          differ from the final price at checkout on the partner&apos;s site.
        </p>
      </section>

      <section id="affiliate" className="space-y-2">
        <h2 className="text-xl font-semibold">5. Affiliate Links</h2>
        <p>
          Some ticket links on BunActivity are affiliate links. We may earn a
          commission when you purchase tickets through these links, at no extra cost to
          you. See our{" "}
          <Link href="/affiliate-disclosure" className="underline">
            Affiliate Disclosure
          </Link>{" "}
          for details.
        </p>
      </section>

      <section id="ip" className="space-y-2">
        <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
        <p>
          The BunActivity name, logo, and site design are the property of BunActivity.
          Artist names, images, and likenesses belong to their respective owners and are
          used for informational and editorial purposes only. BunActivity does not
          claim official affiliation with any artist, venue, or event organizer unless
          explicitly stated.
        </p>
      </section>

      <section id="acceptable-use" className="space-y-2">
        <h2 className="text-xl font-semibold">7. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Scrape, copy, or republish BunActivity content at scale without permission</li>
          <li>Use the site to distribute malware or attempt to disrupt its operation</li>
          <li>Misrepresent your identity or affiliation with any artist, venue, or ticketing partner</li>
        </ul>
      </section>

      <section id="third-party" className="space-y-2">
        <h2 className="text-xl font-semibold">8. Third-Party Sites</h2>
        <p>
          BunActivity links to third-party ticketing and social media platforms
          (including TikTok) that we do not control. We are not responsible for the
          content, policies, or practices of those third-party sites.
        </p>
      </section>

      <section id="disclaimer" className="space-y-2">
        <h2 className="text-xl font-semibold">9. Disclaimer of Warranties</h2>
        <p>
          BunActivity is provided &quot;as is&quot; without warranties of any kind,
          express or implied. We do not guarantee the site will be error-free,
          uninterrupted, or that event or ticketing information will be complete or
          current.
        </p>
      </section>

      <section id="liability" className="space-y-2">
        <h2 className="text-xl font-semibold">10. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, BunActivity is not liable for any
          indirect, incidental, or consequential damages arising from your use of the
          site or your purchase of tickets through a third-party partner, including
          canceled events, price changes, or ticketing errors made by that partner.
        </p>
      </section>

      <section id="changes" className="space-y-2">
        <h2 className="text-xl font-semibold">11. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of the site after
          changes are posted means you accept the updated Terms.
        </p>
      </section>

      <section id="contact" className="space-y-2">
        <h2 className="text-xl font-semibold">12. Contact Us</h2>
        <p>
          Questions about these Terms? Reach out via our{" "}
          <Link href="/contact" className="underline">
            Contact page
          </Link>
          .
        </p>
      </section>
    </main>
  );
}

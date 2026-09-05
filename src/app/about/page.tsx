export const metadata = {
  title: "About BunActivity",
};

export default function AboutPage() {
  return (
    <main className="px-6 py-16 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">About BunActivity</h1>

      <p>
        BunActivity is a fast, modern way to discover what&apos;s happening — concerts,
        artists, and live events across the U.S. Bun Bun Bun — Let&apos;s Have Some Fun.
      </p>

      <h2 className="text-xl font-semibold">Why we built this</h2>
      <p>
        Finding a concert shouldn&apos;t mean digging through a dozen tabs. BunActivity
        brings artists, cities, and upcoming shows together in one clean, easy place to
        browse — no account required.
      </p>

      <h2 className="text-xl font-semibold">What we offer</h2>
      <p>
        Browse upcoming concerts by artist, city, or date, learn about the artists
        themselves, and get sent directly to a ticketing partner when you&apos;re ready
        to buy.
      </p>

      <h2 className="text-xl font-semibold">How events are added</h2>
      <p>
        Our team reviews and adds events and artist information. If you spot something
        that needs a correction, use the <a href="/contact" className="underline">contact page</a> to
        let us know.
      </p>

      <h2 className="text-xl font-semibold">About ticket links</h2>
      <p>
        BunActivity does not sell tickets directly. The &quot;Get Tickets&quot; button
        sends you to a ticketing partner&apos;s site to complete your purchase. See our{" "}
        <a href="/affiliate-disclosure" className="underline">Affiliate Disclosure</a> for
        details.
      </p>
    </main>
  );
}

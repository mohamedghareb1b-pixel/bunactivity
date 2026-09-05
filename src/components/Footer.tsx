import Link from "next/link";

export default function Footer({ tiktokUrl }: { tiktokUrl?: string | null }) {
  return (
    <footer className="bg-[var(--color-coffee-light)] text-[var(--color-ivory)] mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="font-bold text-xl mb-2">BUN</div>
          <p className="text-sm opacity-90">Bun Bun Bun — Let&apos;s Have Some Fun</p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <Link href="/concerts">Concerts</Link>
          <Link href="/artists">Artists</Link>
          <Link href="/cities">Cities</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          {tiktokUrl && (
            <a href={tiktokUrl} target="_blank" rel="noopener noreferrer">
              TikTok
            </a>
          )}
          <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
}

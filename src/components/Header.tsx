import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-[var(--color-ivory)]/95 backdrop-blur border-b border-[var(--color-beige)]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight">
          <Image
            src="/founder.jpg"
            alt="BunActivity founder"
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
          BUN
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/concerts">Concerts</Link>
          <Link href="/artists">Artists</Link>
          <Link href="/cities">Cities</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <Link
          href="/search"
          className="text-sm underline md:no-underline md:btn-primary md:px-4 md:py-2"
        >
          Search
        </Link>
      </div>
    </header>
  );
}

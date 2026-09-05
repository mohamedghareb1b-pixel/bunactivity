import Link from "next/link";
import Image from "next/image";
import MobileNav from "@/components/MobileNav";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-[var(--color-ivory)]/95 backdrop-blur border-b border-[var(--color-beige)]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex flex-col leading-tight shrink-0">
          <span className="flex items-center gap-2 font-bold text-2xl tracking-tight">
            <Image
              src="/founder.jpg"
              alt="BunActivity founder"
              width={36}
              height={36}
              className="rounded-full object-cover"
            />
            BUN
          </span>
          <span
            className="text-xs italic mt-0.5"
            style={{ color: "var(--color-coffee-light)" }}
          >
            Let&apos;s Have Some Fun
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/concerts">Concerts</Link>
          <Link href="/artists">Artists</Link>
          <Link href="/cities">Cities</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
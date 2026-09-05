import Image from "next/image";
import Link from "next/link";
import ShareButton from "@/components/public/ShareButton";

interface EventCardProps {
  slug: string;
  name: string;
  artistNames: string[];
  city?: string | null;
  state?: string | null;
  venueName?: string | null;
  date: Date;
  time?: string | null;
  image?: string | null;
}

export default function EventCard({
  slug,
  name,
  artistNames,
  city,
  state,
  venueName,
  date,
  time,
  image,
}: EventCardProps) {
  const dateLabel = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const eventUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://bunactivity.com"}/events/${slug}`;

  return (
    <div className="card">
      <Link href={`/events/${slug}`} className="block">
        <div className="relative w-full aspect-video bg-[var(--color-coffee-light)] rounded-t-xl overflow-hidden">
          {image && (
            <Image src={image} alt={name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
          )}
        </div>
        <div className="p-4 pb-2 space-y-1">
          <div className="font-semibold">{name}</div>
          {artistNames.length > 0 && (
            <div className="text-sm opacity-80">{artistNames.join(" + ")}</div>
          )}
          {(city || venueName) && (
            <div className="text-sm opacity-70">
              {[venueName, city && state ? `${city}, ${state}` : city].filter(Boolean).join(" · ")}
            </div>
          )}
          <div className="text-sm opacity-70">
            {dateLabel}
            {time ? ` · ${time}` : ""}
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4 flex items-center gap-2">
        <a
          href={`/go/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-block px-4 py-2 text-sm"
        >
          Get Tickets
        </a>
        <ShareButton url={eventUrl} title={name} />
      </div>
    </div>
  );
}
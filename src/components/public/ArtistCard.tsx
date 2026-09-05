import Image from "next/image";
import Link from "next/link";

interface ArtistCardProps {
  slug: string;
  name: string;
  image?: string | null;
  nextEvent?: {
    city?: string | null;
    date: Date;
  } | null;
}

export default function ArtistCard({ slug, name, image, nextEvent }: ArtistCardProps) {
  const dateLabel = nextEvent?.date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/artists/${slug}`} className="card block overflow-hidden text-center">
      <div className="relative w-full aspect-square bg-[var(--color-coffee-light)]">
        {image && (
          <Image src={image} alt={name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 20vw" />
        )}
      </div>
      <div className="p-3">
        <div className="font-semibold">{name}</div>
        {nextEvent && (
          <div className="text-sm opacity-70">
            {nextEvent.city ? `${nextEvent.city} · ` : ""}
            {dateLabel}
          </div>
        )}
      </div>
    </Link>
  );
}

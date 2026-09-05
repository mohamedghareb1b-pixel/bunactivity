import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import EventCard from "@/components/public/EventCard";
import ArtistCard from "@/components/public/ArtistCard";
import JsonLd from "@/components/JsonLd";
import { musicGroupJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

async function getArtist(slug: string) {
  return prisma.artist.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      events: {
        include: { event: { include: { venue: { include: { city: true } }, artists: { include: { artist: true } } } } },
        orderBy: { event: { date: "asc" } },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artist = await getArtist(params.slug);
  if (!artist) return {};
  return {
    title: artist.seoTitle ?? artist.name,
    description: artist.seoDescription ?? artist.shortBio ?? undefined,
    alternates: {
      canonical: `/artists/${artist.slug}`,
    },
    openGraph: {
      title: artist.seoTitle ?? artist.name,
      description: artist.seoDescription ?? artist.shortBio ?? undefined,
      type: "website",
      url: `/artists/${artist.slug}`,
      ...(artist.image ? { images: [{ url: artist.image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      ...(artist.image ? { images: [artist.image] } : {}),
    },
  };
}

export default async function ArtistPage({ params }: Props) {
  const artist = await getArtist(params.slug);
  if (!artist) notFound();

  const now = new Date();
  const events = artist.events.map((ea) => ea.event).sort((a, b) => a.date.getTime() - b.date.getTime());
  const upcoming = events.filter((e) => e.date.getTime() > now.getTime());
  const nextConcert = upcoming[0];

  const songs = (artist.songs as { name: string; releaseYear?: number }[] | null) ?? [];
  const socialLinks = (artist.socialLinks as { tiktok?: string } | null) ?? {};

  // Related artists: other artists who share an event with this one
  const relatedArtistsMap = new Map<string, { slug: string; name: string; image: string | null }>();
  for (const event of events) {
    for (const ea of event.artists) {
      if (ea.artist.slug !== artist.slug) {
        relatedArtistsMap.set(ea.artist.slug, {
          slug: ea.artist.slug,
          name: ea.artist.name,
          image: ea.artist.image,
        });
      }
    }
  }
  const relatedArtists = Array.from(relatedArtistsMap.values()).slice(0, 8);

  return (
    <main className="px-6 py-16 max-w-4xl mx-auto space-y-12">
      <JsonLd
        data={[
          musicGroupJsonLd({
            name: artist.name,
            slug: artist.slug,
            image: artist.image,
            bio: artist.shortBio,
            genre: artist.genre,
            tiktokUrl: socialLinks.tiktok,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Artists", path: "/concerts" },
            { name: artist.name, path: `/artists/${artist.slug}` },
          ]),
        ]}
      />

      <nav className="text-sm opacity-60">
        <Link href="/">Home</Link> / {artist.name}
      </nav>

      {/* Artist Header */}
      <section className="flex flex-col sm:flex-row gap-6 items-start">
        {artist.image && (
          <div className="relative w-40 h-40 rounded-full overflow-hidden shrink-0">
            <Image src={artist.image} alt={artist.name} fill className="object-cover" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">{artist.name}</h1>
          {artist.shortBio && <p className="mt-2 opacity-80">{artist.shortBio}</p>}
          {socialLinks.tiktok && (
            <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="underline text-sm mt-2 inline-block">
              TikTok
            </a>
          )}
        </div>
      </section>

      {/* About */}
      {artist.biography && (
        <section>
          <h2 className="text-2xl font-semibold mb-3">About {artist.name}</h2>
          <p className="opacity-90 whitespace-pre-line">{artist.biography}</p>
        </section>
      )}

      {/* Popular Songs */}
      {songs.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-3">Popular Songs</h2>
          <ul className="space-y-1">
            {songs.map((s, i) => (
              <li key={i} className="flex justify-between border-b py-2">
                <span>{s.name}</span>
                {s.releaseYear && <span className="opacity-60">{s.releaseYear}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Next Concert */}
      {nextConcert && (
        <section>
          <h2 className="text-2xl font-semibold mb-3">Next Concert</h2>
          <div className="max-w-md">
            <EventCard
              slug={nextConcert.slug}
              name={nextConcert.name}
              artistNames={nextConcert.artists.map((ea) => ea.artist.name)}
              city={nextConcert.venue?.city?.name}
              state={nextConcert.venue?.state}
              venueName={nextConcert.venue?.name}
              date={nextConcert.date}
              time={nextConcert.time}
              image={nextConcert.image}
            />
          </div>
        </section>
      )}

      {/* Upcoming Concerts */}
      {upcoming.length > 1 && (
        <section>
          <h2 className="text-2xl font-semibold mb-3">Upcoming Concerts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {upcoming.slice(1).map((e) => (
              <EventCard
                key={e.id}
                slug={e.slug}
                name={e.name}
                artistNames={e.artists.map((ea) => ea.artist.name)}
                city={e.venue?.city?.name}
                state={e.venue?.state}
                venueName={e.venue?.name}
                date={e.date}
                time={e.time}
                image={e.image}
              />
            ))}
          </div>
        </section>
      )}

      {/* Related Artists */}
      {relatedArtists.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-3">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedArtists.map((a) => (
              <ArtistCard key={a.slug} slug={a.slug} name={a.name} image={a.image} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

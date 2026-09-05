import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import EventCard from "@/components/public/EventCard";
import ArtistCard from "@/components/public/ArtistCard";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";

interface Props {
  params: { slug: string };
}

async function getCity(slug: string) {
  return prisma.city.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = await getCity(params.slug);
  if (!city) return {};
  return {
    title: `Concerts in ${city.name}`,
    description: `Discover upcoming concerts and live events in ${city.name}${city.state ? `, ${city.state}` : ""}.`,
    alternates: {
      canonical: `/cities/${city.slug}`,
    },
  };

export default async function CityPage({ params }: Props) {
  const city = await getCity(params.slug);
  if (!city) notFound();

  const now = new Date();
  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const events = await prisma.event.findMany({
    where: {
      publishStatus: "PUBLISHED",
      status: "UPCOMING",
      venue: { cityId: city.id },
    },
    orderBy: { date: "asc" },
    include: { artists: { include: { artist: true } }, venue: true },
  });

  const thisWeek = events.filter((e) => e.date <= weekFromNow);

  const artistMap = new Map<string, { slug: string; name: string; image: string | null }>();
  for (const e of events) {
    for (const ea of e.artists) {
      artistMap.set(ea.artist.slug, { slug: ea.artist.slug, name: ea.artist.name, image: ea.artist.image });
    }
  }
  const artists = Array.from(artistMap.values());

  return (
    <main className="px-6 py-16 max-w-4xl mx-auto space-y-12">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Cities", path: "/concerts" },
          { name: city.name, path: `/cities/${city.slug}` },
        ])}
      />

      <nav className="text-sm opacity-60">
        <Link href="/">Home</Link> / {city.name}
      </nav>

      <h1 className="text-3xl font-bold">
        Concerts in {city.name}
        {city.state ? `, ${city.state}` : ""}
      </h1>

      {events.length > 0 ? (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((e) => (
              <EventCard
                key={e.id}
                slug={e.slug}
                name={e.name}
                artistNames={e.artists.map((ea) => ea.artist.name)}
                city={city.name}
                state={e.venue?.state}
                venueName={e.venue?.name}
                date={e.date}
                time={e.time}
                image={e.image}
              />
            ))}
          </div>
        </section>
      ) : (
        <p className="opacity-70">No upcoming events in {city.name} right now — check back soon.</p>
      )}

      {thisWeek.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">This Week&apos;s Concerts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {thisWeek.map((e) => (
              <EventCard
                key={e.id}
                slug={e.slug}
                name={e.name}
                artistNames={e.artists.map((ea) => ea.artist.name)}
                city={city.name}
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

      {artists.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Artists Performing in {city.name}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {artists.map((a) => (
              <ArtistCard key={a.slug} slug={a.slug} name={a.name} image={a.image} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

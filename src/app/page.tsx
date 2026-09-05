import { prisma } from "@/lib/prisma";
import Link from "next/link";
import EventCard from "@/components/public/EventCard";
import ArtistCard from "@/components/public/ArtistCard";
import CityCard from "@/components/public/CityCard";
import SearchBar from "@/components/public/SearchBar";

function startOfWeek() {
  return new Date();
}
function endOfWeek() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d;
}

export default async function HomePage() {
  const [upcomingEvents, trendingArtists, cities, thisWeekEvents, featuredEvent] =
    await Promise.all([
      prisma.event.findMany({
        where: { publishStatus: "PUBLISHED", status: "UPCOMING" },
        orderBy: { date: "asc" },
        take: 8,
        include: { artists: { include: { artist: true } }, venue: { include: { city: true } } },
      }),
      prisma.artist.findMany({
        where: { status: "PUBLISHED", featured: true },
        take: 8,
        include: {
          events: {
            include: { event: { include: { venue: { include: { city: true } } } } },
            orderBy: { event: { date: "asc" } },
            take: 1,
          },
        },
      }),
      prisma.city.findMany({ take: 6, orderBy: { name: "asc" } }),
      prisma.event.findMany({
        where: {
          publishStatus: "PUBLISHED",
          status: "UPCOMING",
          date: { gte: startOfWeek(), lte: endOfWeek() },
        },
        orderBy: { date: "asc" },
        take: 6,
        include: { artists: { include: { artist: true } }, venue: { include: { city: true } } },
      }),
      prisma.event.findFirst({
        where: { publishStatus: "PUBLISHED", featured: true, status: "UPCOMING" },
        include: { artists: { include: { artist: true } }, venue: { include: { city: true } } },
      }),
    ]);

  return (
    <main>
      {/* Hero */}
      <section className="px-6 py-8 sm:py-12 text-center">
        <h1 className="text-4xl font-bold">Find Your Next Night Out.</h1>
        <p className="mt-2 text-lg">
          Discover concerts, artists and live events.
        </p>
        <div className="mt-6">
          <SearchBar />
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="px-6 pt-2 pb-10 sm:pt-6">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingEvents.map((e) => (
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
          <div className="text-center mt-6">
            <Link href="/concerts" className="btn-primary inline-block px-6 py-3">
              View All Concerts
            </Link>
          </div>
        </section>
      )}

      {/* Trending Artists */}
      {trendingArtists.length > 0 && (
        <section className="px-6 py-10">
          <h2 className="text-2xl font-semibold mb-4">Trending Artists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {trendingArtists.map((a) => {
              const next = a.events[0]?.event;
              return (
                <ArtistCard
                  key={a.id}
                  slug={a.slug}
                  name={a.name}
                  image={a.image}
                  nextEvent={next ? { city: next.venue?.city?.name, date: next.date } : null}
                />
              );
            })}
          </div>
          <div className="text-center mt-6">
            <Link href="/artists" className="btn-primary inline-block px-6 py-3">
              View All Artists
            </Link>
          </div>
        </section>
      )}

      {/* Popular Cities */}
      {cities.length > 0 && (
        <section className="px-6 py-10">
          <h2 className="text-2xl font-semibold mb-4">Popular Cities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {cities.map((c) => (
              <CityCard key={c.id} slug={c.slug} name={c.name} />
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/cities" className="btn-primary inline-block px-6 py-3">
              View All Cities
            </Link>
          </div>
        </section>
      )}

      {/* This Week */}
      {thisWeekEvents.length > 0 && (
        <section className="px-6 py-10">
          <h2 className="text-2xl font-semibold mb-4">
            What&apos;s happening this week?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {thisWeekEvents.map((e) => (
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

      {/* Featured Event */}
      {featuredEvent && (
        <section className="px-6 py-10">
          <h2 className="text-2xl font-semibold mb-4">Featured Event</h2>
          <div className="max-w-2xl">
            <EventCard
              slug={featuredEvent.slug}
              name={featuredEvent.name}
              artistNames={featuredEvent.artists.map((ea) => ea.artist.name)}
              city={featuredEvent.venue?.city?.name}
              state={featuredEvent.venue?.state}
              venueName={featuredEvent.venue?.name}
              date={featuredEvent.date}
              time={featuredEvent.time}
              image={featuredEvent.image}
            />
          </div>
        </section>
      )}
    </main>
  );
}
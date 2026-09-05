import { prisma } from "@/lib/prisma";
import EventCard from "@/components/public/EventCard";
import ArtistCard from "@/components/public/ArtistCard";
import CityCard from "@/components/public/CityCard";
import SearchBar from "@/components/public/SearchBar";

export const metadata = {
  title: "Search",
};

interface Props {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: Props) {
  const q = searchParams.q?.trim() ?? "";

  if (!q) {
    return (
      <main className="px-6 py-16 max-w-3xl mx-auto text-center">
        <SearchBar />
      </main>
    );
  }

  const [artists, events, cities] = await Promise.all([
    prisma.artist.findMany({
      where: { status: "PUBLISHED", name: { contains: q, mode: "insensitive" } },
      take: 8,
    }),
    prisma.event.findMany({
      where: {
        publishStatus: "PUBLISHED",
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { venue: { name: { contains: q, mode: "insensitive" } } },
          { artists: { some: { artist: { name: { contains: q, mode: "insensitive" } } } } },
        ],
      },
      include: { artists: { include: { artist: true } }, venue: { include: { city: true } } },
      take: 8,
    }),
    prisma.city.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      take: 8,
    }),
  ]);

  const hasResults = artists.length > 0 || events.length > 0 || cities.length > 0;

  return (
    <main className="px-6 py-16 max-w-4xl mx-auto space-y-10">
      <SearchBar initialValue={q} />

      <h1 className="text-2xl font-bold">Results for &quot;{q}&quot;</h1>

      {!hasResults && <p className="opacity-70">No results found. Try a different search.</p>}

      {events.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((e) => (
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

      {artists.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Artists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {artists.map((a) => (
              <ArtistCard key={a.id} slug={a.slug} name={a.name} image={a.image} />
            ))}
          </div>
        </section>
      )}

      {cities.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Cities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {cities.map((c) => (
              <CityCard key={c.id} slug={c.slug} name={c.name} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

import { prisma } from "@/lib/prisma";
import EventCard from "@/components/public/EventCard";
import ConcertsFilterBar from "@/components/public/ConcertsFilterBar";
import Pagination from "@/components/public/Pagination";
import { resolveDateRange } from "@/lib/date-filters";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Concerts",
  alternates: {
    canonical: "/concerts",
  },
};

const PAGE_SIZE = 12;

interface Props {
  searchParams: {
    date?: string;
    from?: string;
    to?: string;
    city?: string;
    artist?: string;
    page?: string;
  };
}

export default async function ConcertsPage({ searchParams }: Props) {
  const { gte, lte } = resolveDateRange(searchParams.date, searchParams.from, searchParams.to);

  const currentPage = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);

  const where = {
    publishStatus: "PUBLISHED" as const,
    status: "UPCOMING" as const,
    ...(gte || lte ? { date: { ...(gte ? { gte } : {}), ...(lte ? { lte } : {}) } } : {}),
    ...(searchParams.city ? { venue: { city: { slug: searchParams.city } } } : {}),
    ...(searchParams.artist ? { artists: { some: { artist: { slug: searchParams.artist } } } } : {}),
  };

  const [totalCount, events, cities, artists] = await Promise.all([
    prisma.event.count({ where }),
    prisma.event.findMany({
      where,
      orderBy: { date: "asc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { artists: { include: { artist: true } }, venue: { include: { city: true } } },
    }),
    prisma.city.findMany({ orderBy: { name: "asc" }, select: { slug: true, name: true } }),
    prisma.artist.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <main className="px-6 py-8 sm:py-12 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Concerts</h1>

      <ConcertsFilterBar
        cities={cities.map((c) => ({ value: c.slug, label: c.name }))}
        artists={artists.map((a) => ({ value: a.slug, label: a.name }))}
      />

      {events.length > 0 ? (
        <>
          <p className="text-sm opacity-60 mb-4">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount} concerts
          </p>
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
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </>
      ) : (
        <p className="opacity-70">No concerts match these filters.</p>
      )}
    </main>
  );
}
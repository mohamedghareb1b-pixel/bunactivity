import { prisma } from "@/lib/prisma";
import ArtistCard from "@/components/public/ArtistCard";

export const metadata = {
  title: "Artists",
};

export default async function ArtistsIndexPage() {
  const artists = await prisma.artist.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { name: "asc" },
    include: {
      events: {
        where: { event: { status: "UPCOMING" } },
        include: { event: { include: { venue: { include: { city: true } } } } },
        orderBy: { event: { date: "asc" } },
        take: 1,
      },
    },
  });

  return (
    <main className="px-6 py-16 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Artists</h1>

      {artists.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {artists.map((a) => {
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
      ) : (
        <p className="opacity-70">No artists published yet.</p>
      )}
    </main>
  );
}

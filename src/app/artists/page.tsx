import { prisma } from "@/lib/prisma";
import ArtistsSearchList from "@/components/public/ArtistsSearchList";

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

  const items = artists.map((a) => {
    const next = a.events[0]?.event;
    return {
      id: a.id,
      slug: a.slug,
      name: a.name,
      image: a.image,
      nextEvent: next ? { city: next.venue?.city?.name, date: next.date } : null,
    };
  });

  return (
    <main className="px-6 py-8 sm:py-12 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Artists</h1>

      {items.length > 0 ? (
        <ArtistsSearchList artists={items} />
      ) : (
        <p className="opacity-70">No artists published yet.</p>
      )}
    </main>
  );
}
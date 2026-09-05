import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventForm from "@/components/admin/EventForm";

interface Props {
  params: { id: string };
}

export default async function EditEventPage({ params }: Props) {
  const [event, artists] = await Promise.all([
    prisma.event.findUnique({
      where: { id: params.id },
      include: { artists: true, venue: { include: { city: true } } },
    }),
    prisma.artist.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  if (!event) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      <EventForm
        artistOptions={artists}
        initialValues={{
          id: event.id,
          name: event.name,
          slug: event.slug,
          image: event.image ?? undefined,
          description: event.description ?? undefined,
          date: event.date.toISOString().slice(0, 10),
          time: event.time ?? undefined,
          timezone: event.timezone ?? undefined,
          venueName: event.venue?.name,
          city: event.venue?.city?.name,
          state: event.venue?.state ?? undefined,
          country: event.venue?.country ?? undefined,
          ticketUrl: event.ticketUrl,
          affiliateProvider: event.affiliateProvider ?? undefined,
          seoTitle: event.seoTitle ?? undefined,
          seoDescription: event.seoDescription ?? undefined,
          featured: event.featured,
          publishStatus: event.publishStatus,
          artistIds: event.artists.map((ea) => ea.artistId),
        }}
      />
    </div>
  );
}

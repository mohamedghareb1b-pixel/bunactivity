import { prisma } from "@/lib/prisma";
import EventForm from "@/components/admin/EventForm";

export default async function NewEventPage() {
  const artists = await prisma.artist.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Event</h1>
      <EventForm artistOptions={artists} />
    </div>
  );
}

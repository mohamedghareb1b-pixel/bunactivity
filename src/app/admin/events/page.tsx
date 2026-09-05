import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
    include: { artists: { include: { artist: true } }, venue: true },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <Link href="/admin/events/new" className="btn-primary px-4 py-2">
          + New Event
        </Link>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Name</th>
            <th>Date</th>
            <th>Artists</th>
            <th>Status</th>
            <th>Published</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id} className="border-b">
              <td className="py-2">{e.name}</td>
              <td>{e.date.toISOString().slice(0, 10)}</td>
              <td>{e.artists.map((ea) => ea.artist.name).join(", ")}</td>
              <td>{e.status}</td>
              <td>{e.publishStatus}</td>
              <td>
                <Link href={`/admin/events/${e.id}`} className="underline">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

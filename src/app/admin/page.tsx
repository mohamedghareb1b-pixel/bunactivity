import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [totalEvents, totalArtists, upcomingEvents, totalClicks] = await Promise.all([
    prisma.event.count(),
    prisma.artist.count(),
    prisma.event.count({ where: { status: "UPCOMING" } }),
    prisma.event.aggregate({ _sum: { clicks: true } }),
  ]);

  const topEvents = await prisma.event.findMany({
    orderBy: { clicks: "desc" },
    take: 5,
    select: { id: true, name: true, clicks: true },
  });

  const stats = [
    { label: "Total Events", value: totalEvents },
    { label: "Total Artists", value: totalArtists },
    { label: "Upcoming Events", value: upcomingEvents },
    { label: "Total Clicks", value: totalClicks._sum.clicks ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <div className="text-sm opacity-70">{s.label}</div>
            <div className="text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-3">Top Events by Clicks</h2>
      <ul className="space-y-2">
        {topEvents.map((e) => (
          <li key={e.id} className="card p-3 flex justify-between">
            <span>{e.name}</span>
            <span className="font-semibold">{e.clicks}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

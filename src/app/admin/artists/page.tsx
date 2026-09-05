import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminArtistsPage() {
  const artists = await prisma.artist.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Artists</h1>
        <Link href="/admin/artists/new" className="btn-primary px-4 py-2">
          + New Artist
        </Link>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Name</th>
            <th>Status</th>
            <th>Featured</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {artists.map((a) => (
            <tr key={a.id} className="border-b">
              <td className="py-2">{a.name}</td>
              <td>{a.status}</td>
              <td>{a.featured ? "Yes" : "No"}</td>
              <td>
                <Link href={`/admin/artists/${a.id}`} className="underline">
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

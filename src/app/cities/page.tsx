import { prisma } from "@/lib/prisma";
import CityCard from "@/components/public/CityCard";

export const metadata = {
  title: "Cities",
};

export default async function CitiesIndexPage() {
  const cities = await prisma.city.findMany({ orderBy: { name: "asc" } });

  return (
    <main className="px-6 py-16 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Cities</h1>

      {cities.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {cities.map((c) => (
            <CityCard key={c.id} slug={c.slug} name={c.name} />
          ))}
        </div>
      ) : (
        <p className="opacity-70">No cities yet.</p>
      )}
    </main>
  );
}

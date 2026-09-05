import Link from "next/link";

interface CityCardProps {
  slug: string;
  name: string;
}

export default function CityCard({ slug, name }: CityCardProps) {
  return (
    <Link
      href={`/cities/${slug}`}
      className="card flex items-center justify-center py-6 font-semibold hover:opacity-90"
    >
      {name}
    </Link>
  );
}

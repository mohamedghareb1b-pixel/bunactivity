import Link from "next/link";

export default function NotFound() {
  return (
    <main className="px-6 py-24 text-center">
      <h1 className="text-2xl font-bold">
        Looks like this event disappeared.
      </h1>
      <Link href="/concerts" className="btn-primary inline-block mt-6 px-6 py-3">
        Find Upcoming Events
      </Link>
    </main>
  );
}

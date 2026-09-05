import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import EventCard from "@/components/public/EventCard";
import JsonLd from "@/components/JsonLd";
import { eventJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";

interface Props {
  params: { slug: string };
}

async function getEvent(slug: string) {
  return prisma.event.findUnique({
    where: { slug, publishStatus: "PUBLISHED" },
    include: {
      artists: { include: { artist: true } },
      venue: { include: { city: true } },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEvent(params.slug);
  if (!event) return {};
  return {
    title: event.seoTitle ?? event.name,
    description: event.seoDescription ?? event.description ?? undefined,
    alternates: {
      canonical: `/events/${event.slug}`,
    },
    openGraph: {
      title: event.seoTitle ?? event.name,
      description: event.seoDescription ?? event.description ?? undefined,
      type: "website",
      url: `/events/${event.slug}`,
      ...(event.image ? { images: [{ url: event.image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      ...(event.image ? { images: [event.image] } : {}),
    },
  };
}

export default async function EventPage({ params }: Props) {
  const event = await getEvent(params.slug);
  if (!event) notFound();

  const artistIds = event.artists.map((ea) => ea.artistId);

  const relatedEvents = artistIds.length
    ? await prisma.event.findMany({
        where: {
          publishStatus: "PUBLISHED",
          status: "UPCOMING",
          id: { not: event.id },
          artists: { some: { artistId: { in: artistIds } } },
        },
        include: { artists: { include: { artist: true } }, venue: { include: { city: true } } },
        take: 4,
      })
    : [];

  const dateLabel = event.date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="px-6 py-16 max-w-3xl mx-auto space-y-8">
      <JsonLd
        data={[
          eventJsonLd({
            name: event.name,
            slug: event.slug,
            description: event.description,
            image: event.image,
            date: event.date,
            time: event.time,
            ticketUrl: event.ticketUrl,
            venueName: event.venue?.name,
            city: event.venue?.city?.name,
            state: event.venue?.state,
            country: event.venue?.country,
            artistNames: event.artists.map((ea) => ea.artist.name),
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Concerts", path: "/concerts" },
            { name: event.name, path: `/events/${event.slug}` },
          ]),
        ]}
      />

      <nav className="text-sm opacity-60">
        <Link href="/">Home</Link> / <Link href="/concerts">Concerts</Link> / {event.name}
      </nav>

      {event.image && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
          <Image src={event.image} alt={event.name} fill className="object-cover" />
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <p className="mt-2 opacity-80">
          {event.artists.map((ea) => ea.artist.name).join(" + ")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="opacity-60">Date</div>
          <div className="font-medium">{dateLabel}</div>
        </div>
        {event.time && (
          <div>
            <div className="opacity-60">Time</div>
            <div className="font-medium">{event.time}</div>
          </div>
        )}
        {event.venue?.name && (
          <div>
            <div className="opacity-60">Venue</div>
            <div className="font-medium">{event.venue.name}</div>
          </div>
        )}
        {event.venue?.city?.name && (
          <div>
            <div className="opacity-60">City</div>
            <div className="font-medium">
              {event.venue.city.name}
              {event.venue.state ? `, ${event.venue.state}` : ""}
            </div>
          </div>
        )}
      </div>

      {event.description && <p className="opacity-90 whitespace-pre-line">{event.description}</p>}

      <div>
        <a
          href={`/go/${event.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-block px-6 py-3"
        >
          Get Tickets
        </a>
        <p className="text-xs opacity-60 mt-2">
          BunActivity may earn a commission from qualifying purchases made through some ticket links.{" "}
          <Link href="/affiliate-disclosure" className="underline">
            Learn more
          </Link>
        </p>
      </div>

      {relatedEvents.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-3">Related Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedEvents.map((e) => (
              <EventCard
                key={e.id}
                slug={e.slug}
                name={e.name}
                artistNames={e.artists.map((ea) => ea.artist.name)}
                city={e.venue?.city?.name}
                state={e.venue?.state}
                venueName={e.venue?.name}
                date={e.date}
                time={e.time}
                image={e.image}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

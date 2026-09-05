const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bunactivity.com";
const SITE_NAME = "BunActivity";

interface EventSchemaInput {
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  date: Date;
  time?: string | null;
  ticketUrl: string;
  venueName?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  artistNames: string[];
}

export function eventJsonLd(e: EventSchemaInput) {
  const startDate = e.time ? `${e.date.toISOString().slice(0, 10)}T${e.time}` : e.date.toISOString();

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.name,
    startDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    url: `${SITE_URL}/events/${e.slug}`,
    ...(e.image ? { image: [e.image] } : {}),
    ...(e.description ? { description: e.description } : {}),
    location: {
      "@type": "Place",
      name: e.venueName ?? "TBA",
      address: {
        "@type": "PostalAddress",
        addressLocality: e.city ?? undefined,
        addressRegion: e.state ?? undefined,
        addressCountry: e.country ?? "US",
      },
    },
    performer: e.artistNames.map((name) => ({
      "@type": "MusicGroup",
      name,
    })),
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/go/${e.slug}`,
      availability: "https://schema.org/InStock",
    },
  };
}

interface ArtistSchemaInput {
  name: string;
  slug: string;
  image?: string | null;
  bio?: string | null;
  genre?: string | null;
  tiktokUrl?: string | null;
}

export function musicGroupJsonLd(a: ArtistSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: a.name,
    url: `${SITE_URL}/artists/${a.slug}`,
    ...(a.image ? { image: a.image } : {}),
    ...(a.bio ? { description: a.bio } : {}),
    ...(a.genre ? { genre: a.genre } : {}),
    ...(a.tiktokUrl ? { sameAs: [a.tiktokUrl] } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

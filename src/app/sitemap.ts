import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bunactivity.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/concerts",
    "/about",
    "/contact",
    "/faq",
    "/affiliate-disclosure",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const [artists, events, cities] = await Promise.all([
    prisma.artist.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.event.findMany({ where: { publishStatus: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.city.findMany({ select: { slug: true } }),
  ]);

  const artistRoutes = artists.map((a) => ({
    url: `${BASE_URL}/artists/${a.slug}`,
    lastModified: a.updatedAt,
  }));
  const eventRoutes = events.map((e) => ({
    url: `${BASE_URL}/events/${e.slug}`,
    lastModified: e.updatedAt,
  }));
  const cityRoutes = cities.map((c) => ({
    url: `${BASE_URL}/cities/${c.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...artistRoutes, ...eventRoutes, ...cityRoutes];
}

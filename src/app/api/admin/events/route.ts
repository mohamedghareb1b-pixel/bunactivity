import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveVenueId } from "@/lib/venue";
import { z } from "zod";

const eventSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  image: z.string().optional(),
  description: z.string().optional(),
  date: z.string().min(1), // yyyy-mm-dd
  time: z.string().optional(),
  timezone: z.string().optional(),
  venueName: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  ticketUrl: z.string().min(1),
  affiliateProvider: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  featured: z.boolean().default(false),
  publishStatus: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  artistIds: z.array(z.string()).default([]),
});

// PRD §41: status is derived from date vs now, never set manually
function computeStatus(dateStr: string): "UPCOMING" | "PAST" {
  return new Date(dateStr).getTime() > Date.now() ? "UPCOMING" : "PAST";
}

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
    include: { artists: { include: { artist: true } }, venue: true },
  });
  return NextResponse.json(events);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = eventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { artistIds, venueName, city, state, country, date, ...rest } = parsed.data;

  const existing = await prisma.event.findUnique({ where: { slug: rest.slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const venueId = await resolveVenueId({ venueName, city, state, country });

  const event = await prisma.event.create({
    data: {
      ...rest,
      date: new Date(date),
      status: computeStatus(date),
      venueId,
      artists: {
        create: artistIds.map((artistId) => ({ artistId })),
      },
    },
  });

  return NextResponse.json(event, { status: 201 });
}

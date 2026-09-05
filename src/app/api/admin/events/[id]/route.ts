import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveVenueId } from "@/lib/venue";
import { z } from "zod";

const eventSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  image: z.string().optional(),
  description: z.string().optional(),
  date: z.string().min(1),
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

function computeStatus(dateStr: string): "UPCOMING" | "PAST" {
  return new Date(dateStr).getTime() > Date.now() ? "UPCOMING" : "PAST";
}

interface Params {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const body = await request.json().catch(() => null);
  const parsed = eventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { artistIds, venueName, city, state, country, date, ...rest } = parsed.data;

  const venueId = await resolveVenueId({ venueName, city, state, country });

  const event = await prisma.$transaction(async (tx) => {
    await tx.eventArtist.deleteMany({ where: { eventId: params.id } });

    return tx.event.update({
      where: { id: params.id },
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
  });

  return NextResponse.json(event);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  await prisma.event.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

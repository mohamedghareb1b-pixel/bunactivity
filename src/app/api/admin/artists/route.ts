import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const artistSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  image: z.string().optional(),
  shortBio: z.string().optional(),
  biography: z.string().optional(),
  genre: z.string().optional(),
  tiktokUrl: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export async function GET() {
  const artists = await prisma.artist.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(artists);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = artistSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { tiktokUrl, ...rest } = parsed.data;

  const existing = await prisma.artist.findUnique({ where: { slug: rest.slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const artist = await prisma.artist.create({
    data: {
      ...rest,
      socialLinks: tiktokUrl ? { tiktok: tiktokUrl } : undefined,
    },
  });

  return NextResponse.json(artist, { status: 201 });
}

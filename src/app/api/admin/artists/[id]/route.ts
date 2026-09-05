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

interface Params {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const body = await request.json().catch(() => null);
  const parsed = artistSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { tiktokUrl, ...rest } = parsed.data;

  const artist = await prisma.artist.update({
    where: { id: params.id },
    data: {
      ...rest,
      socialLinks: tiktokUrl ? { tiktok: tiktokUrl } : undefined,
    },
  });

  return NextResponse.json(artist);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  await prisma.artist.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

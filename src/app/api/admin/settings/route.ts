import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const settingsSchema = z.object({
  siteTitle: z.string().min(1),
  siteDescription: z.string().optional(),
  siteUrl: z.string().optional(),
  defaultOgImage: z.string().optional(),
  googleVerification: z.string().optional(),
  analyticsId: z.string().optional(),
  tagManagerId: z.string().optional(),
  tiktokUrl: z.string().optional(),
  affiliateDisclosure: z.string().optional(),
  defaultAffiliateProvider: z.string().optional(),
});

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = settingsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.siteSettings.findFirst();

  const settings = existing
    ? await prisma.siteSettings.update({ where: { id: existing.id }, data: parsed.data })
    : await prisma.siteSettings.create({ data: parsed.data });

  return NextResponse.json(settings);
}

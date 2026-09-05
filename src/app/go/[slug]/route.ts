import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { slug: string };
}

export async function GET(_request: NextRequest, { params }: Params) {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
    select: { ticketUrl: true, id: true },
  });

  if (!event) {
    return NextResponse.redirect(new URL("/concerts", _request.url));
  }

  // fire-and-forget click increment, don't block the redirect on it
  prisma.event
    .update({ where: { id: event.id }, data: { clicks: { increment: 1 } } })
    .catch(() => {});

  return NextResponse.redirect(event.ticketUrl);
}

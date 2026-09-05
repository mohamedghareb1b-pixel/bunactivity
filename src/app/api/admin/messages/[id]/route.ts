import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const body = await request.json().catch(() => ({}));
  const message = await prisma.contactMessage.update({
    where: { id: params.id },
    data: { read: Boolean(body.read) },
  });
  return NextResponse.json(message);
}

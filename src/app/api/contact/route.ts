import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  subject: z.string().max(200).optional(),
  message: z.string().min(1).max(5000),
  // honeypot field — real users never fill this, bots often do
  company: z.string().max(0).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your inputs and try again." }, { status: 400 });
  }

  // silently accept but drop honeypot-triggered submissions
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    },
  });

  // TODO: also send an email notification (e.g. via Resend/SendGrid) once
  // you have an email provider API key — see README for where to plug it in.

  return NextResponse.json({ ok: true });
}

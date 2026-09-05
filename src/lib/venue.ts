import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function resolveVenueId(input: {
  venueName?: string;
  city?: string;
  state?: string;
  country?: string;
}): Promise<string | undefined> {
  if (!input.venueName && !input.city) return undefined;

  let cityId: string | undefined;
  if (input.city) {
    const citySlug = slugify(input.city);
    const city = await prisma.city.upsert({
      where: { slug: citySlug },
      update: {},
      create: {
        name: input.city,
        slug: citySlug,
        state: input.state,
        country: input.country ?? "US",
      },
    });
    cityId = city.id;
  }

  const existingVenue = await prisma.venue.findFirst({
    where: { name: input.venueName ?? "TBA", cityId },
  });

  const venue = existingVenue
    ? await prisma.venue.update({
        where: { id: existingVenue.id },
        data: { state: input.state, country: input.country ?? "US" },
      })
    : await prisma.venue.create({
        data: {
          name: input.venueName ?? "TBA",
          cityId,
          state: input.state,
          country: input.country ?? "US",
        },
      });

  return venue.id;
}

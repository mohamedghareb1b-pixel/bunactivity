import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ArtistForm from "@/components/admin/ArtistForm";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function EditArtistPage({ params }: Props) {
  const artist = await prisma.artist.findUnique({ where: { id: params.id } });
  if (!artist) notFound();

  const socialLinks = (artist.socialLinks as { tiktok?: string } | null) ?? {};

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Artist</h1>
      <ArtistForm
        initialValues={{
          id: artist.id,
          name: artist.name,
          slug: artist.slug,
          image: artist.image ?? undefined,
          shortBio: artist.shortBio ?? undefined,
          biography: artist.biography ?? undefined,
          genre: artist.genre ?? undefined,
          tiktokUrl: socialLinks.tiktok,
          seoTitle: artist.seoTitle ?? undefined,
          seoDescription: artist.seoDescription ?? undefined,
          featured: artist.featured,
          status: artist.status,
        }}
      />
    </div>
  );
}

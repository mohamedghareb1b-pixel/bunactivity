import { prisma } from "@/lib/prisma";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  let settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: { siteTitle: "BunActivity" } });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">SEO Settings</h1>
      <SettingsForm
        initialValues={{
          siteTitle: settings.siteTitle,
          siteDescription: settings.siteDescription ?? undefined,
          siteUrl: settings.siteUrl ?? undefined,
          defaultOgImage: settings.defaultOgImage ?? undefined,
          googleVerification: settings.googleVerification ?? undefined,
          analyticsId: settings.analyticsId ?? undefined,
          tagManagerId: settings.tagManagerId ?? undefined,
          tiktokUrl: settings.tiktokUrl ?? undefined,
          affiliateDisclosure: settings.affiliateDisclosure ?? undefined,
          defaultAffiliateProvider: settings.defaultAffiliateProvider ?? undefined,
        }}
      />
    </div>
  );
}

import type { Metadata } from "next";
import Script from "next/script";
import "@/styles/globals.css";
import JsonLd from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChromeVisibility from "@/components/ChromeVisibility";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findFirst().catch(() => null);

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://bunactivity.com"),
    title: {
      default: settings?.siteTitle
        ? `${settings.siteTitle} — Discover Concerts, Events & Tickets`
        : "BunActivity — Discover Concerts, Events & Tickets",
      template: `%s | ${settings?.siteTitle ?? "BunActivity"}`,
    },
    description:
      settings?.siteDescription ??
      "Discover upcoming concerts, live events, artists and tickets across the U.S.",
    openGraph: {
      type: "website",
      siteName: settings?.siteTitle ?? "BunActivity",
      ...(settings?.defaultOgImage ? { images: [settings.defaultOgImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
    },
    ...(settings?.googleVerification
      ? { verification: { google: settings.googleVerification } }
      : {}),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await prisma.siteSettings.findFirst().catch(() => null);

  return (
    <html lang="en">
      <body>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />

        {settings?.tagManagerId && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${settings.tagManagerId}');`}
          </Script>
        )}

        {settings?.analyticsId && !settings?.tagManagerId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${settings.analyticsId}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${settings.analyticsId}');`}
            </Script>
          </>
        )}

        <ChromeVisibility header={<Header />} footer={<Footer tiktokUrl={settings?.tiktokUrl} />}>
          {children}
        </ChromeVisibility>
      </body>
    </html>
  );
}

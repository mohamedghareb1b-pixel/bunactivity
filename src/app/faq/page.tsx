import JsonLd from "@/components/JsonLd";

export const metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about how BunActivity works, ticket purchases, affiliate links, and event listings.",
  alternates: {
    canonical: "/faq",
  },
};

const faqs = [
  {
    q: "Are you selling tickets directly?",
    a: "No — BunActivity helps you discover events and directs you to a ticketing partner to complete your purchase.",
  },
  {
    q: "Is BunActivity affiliated with the artists?",
    a: "Not necessarily. BunActivity is not always an official representative of the artists or event organizers listed.",
  },
  {
    q: "Where can I buy tickets?",
    a: "Tap the \"Get Tickets\" button on any event page — it takes you to our ticketing partner's site.",
  },
  {
    q: "Do ticket prices change?",
    a: "Yes, prices and availability can change on the ticketing partner's site at any time.",
  },
  {
    q: "Do you earn money from ticket purchases?",
    a: "Some of our ticket links are affiliate links, and we may earn a commission on qualifying purchases. See our Affiliate Disclosure for details.",
  },
  {
    q: "Can I submit an event?",
    a: "Not yet — event submission is planned for a future update.",
  },
];

export default function FaqPage() {
  return (
    <main className="px-6 py-16 max-w-2xl mx-auto space-y-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }}
      />

      <h1 className="text-3xl font-bold">FAQ</h1>
      <div className="space-y-6">
        {faqs.map((item) => (
          <div key={item.q}>
            <h2 className="font-semibold">{item.q}</h2>
            <p className="opacity-80 mt-1">{item.a}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
import type { Metadata } from "next";
import Layout from "./(mainBody)/layout";
import CarDemo1Container from "@/components/themes/carDemo1/Index";

export const metadata: Metadata = {
  title: "Exelero Group — Yachting and more",
  description:
    "Exelero Yachting: performance and luxury yachts, brokerage & charters, and sailing gear. Explore our partners and services.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Exelero Group — Yachting and more",
    description:
      "Performance and luxury yachts, brokerage & charters, and sailing gear. Explore partners and services with Exelero Yachting.",
    url: "/",
    siteName: "Exelero Yachting",
    type: "website",
    images: [
      {
        url: "/assets/images/hero/x-yachts.jpg",
        width: 1200,
        height: 630,
        alt: "Exelero Yachting — hero image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Exelero Group — Yachting and more",
    description:
      "Performance and luxury yachts, brokerage & charters, and sailing gear. Explore partners and services with Exelero Yachting.",
    images: ["/assets/images/hero/x-yachts.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Exelero Yachting",
    url: "/",
    potentialAction: {
      "@type": "SearchAction",
      target: "/boats?query={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        // JSON-LD must be a string, not an object
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout>
        <CarDemo1Container />
      </Layout>
    </main>
  );
}

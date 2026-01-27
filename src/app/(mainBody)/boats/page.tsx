import BoatsPage from "@/components/pages/boats/BoatsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yachts & Boats for Sale | Exelero Yachting",
  description: "Explore our exclusive collection of high-performance yachts and boats for sale. Find your perfect vessel from top manufacturers with expert dealer support.",
  openGraph: {
    title: "Yachts & Boats for Sale | Exelero Yachting",
    description: "Explore our exclusive collection of high-performance yachts and boats for sale. Find your perfect vessel from top manufacturers with expert dealer support.",
    url: "/boats",
    siteName: "Exelero Yachting",
    type: "website",
    images: [
      {
        url: "/assets/images/hero/main2.png",
        width: 1200,
        height: 630,
        alt: "Exelero Yachting Boats",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yachts & Boats for Sale | Exelero Yachting",
    description: "Explore our exclusive collection of high-performance yachts and boats for sale.",
    images: ["/assets/images/hero/main2.png"],
  },
  alternates: {
    canonical: "/boats",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const Boats = async () => {
  return <BoatsPage />;
};

export default Boats;

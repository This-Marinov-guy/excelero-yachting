import React from "react";
import DynamicExceleroHero from "./DynamicExceleroHero";
import { RouteList } from "@/utils/RouteList";

const CarHomeSection = () => {
  const heroSections = [
    {
      title: "Performance and luxury yachts",
      subtitle: "From coastal cruising to offshore racing",
      overlayVariant: "dark" as const,
      panels: [
        {
          name: "X‑Yachts",
          description: "Performance yachts built with Scandinavian precision.",
          thumbImage: "/assets/images/hero/x-yachts.jpg",
          href: RouteList.Pages.Partners.XYachts,
          variant: "a" as const,
        },
        {
          name: "Omaya Yachts",
          description: "Premium sails and sail solutions for cruising and racing.",
          thumbImage: "/assets/images/hero/omaya-yachts.jpg",
          href: RouteList.Pages.Partners.OmayaYachts,
          variant: "b" as const,
        },
      ],
    },
    {
      title: "Brokerage & Charters",
      description: "Browse listings, request brokerage support, or list your boat for charter — we handle it end‑to‑end.",
      overlayVariant: "darker" as const,
      panels: [
        {
          name: "Brokerage & Charters",
          description: "Find your next boat or get your boat listed with Exelero.",
          thumbImage: "/assets/images/hero/boats.jpg",
          variant: "b" as const,
          href: RouteList.Pages.Boats,
        },
      ],
    },
    {
      title: "Sailing gear",
      description: "Technical apparel and gear for all conditions — from coastal cruising to offshore racing.",
      overlayVariant: "dark" as const,
      panels: [
        {
          name: "Elvstrom",
          description: "Sails and Premium sailwear designed for performance and comfort.",
          thumbImage: "/assets/images/hero/elvstrom.jpg",
          href: RouteList.Pages.Partners.ElvstromSailWear,
          variant: "a" as const,
        },
        {
          name: "Zhik",
          description: "Technical gear trusted by sailors worldwide — engineered to perform.",
          thumbImage: "/assets/images/hero/zhik.jpg",
          href: RouteList.Pages.Partners.Zhik,
          variant: "b" as const,
        },
      ],
    },
  ];

  return (
    <>
      <DynamicExceleroHero
        backgroundVideo="/assets/video/hero/main.m4v"
        backgroundPoster="/assets/images/hero/x-yachts.jpg"
        sections={heroSections}
      />

      {/* <ServiceSection />
      <BoatListingCTA />
      <CarHomeFilter /> */}
    </>
  );
};

export default CarHomeSection;
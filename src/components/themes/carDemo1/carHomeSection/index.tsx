import React from "react";
import CarHomeFilter from "./filterSection";
import ExceleroHero from "./ExceleroHero";
import ServiceSection from "./ServiceSection";
import BoatListingCTA from "./BoatListingCTA";
import { RouteList } from "@/utils/RouteList";
import { HeroScrollWrapper } from "./HeroScrollWrapper";

const CarHomeSection = () => {
  return (
    <>
      <HeroScrollWrapper>
        <ExceleroHero
          title="Performance and luxury yachts"
          subtitle="From coastal cruising to offshore racing"
          backgroundVideo="/assets/video/hero/1.mp4"
          backgroundPoster="/assets/images/hero/x-yachts.jpg"
          overlayVariant="dark"
          separator
          panels={[
            {
              name: "X‑Yachts",
              description: "Performance yachts built with Scandinavian precision.",
              thumbImage: "/assets/images/hero/x-yachts.jpg",
              href: RouteList.Pages.Partners.XYachts,
              variant: "a",
            },
            {
              name: "Omaya Yachts",
              description: "Premium sails and sail solutions for cruising and racing.",
              thumbImage: "/assets/images/hero/omaya-yachts.jpg",
              href: RouteList.Pages.Partners.OmayaYachts,
              variant: "b",
            },
          ]}
        />

        <ExceleroHero
          title="Brokerage & Charters"
          description="Browse listings, request brokerage support, or list your boat for charter — we handle it end‑to‑end."
          backgroundVideo="/assets/video/hero/2.mp4"
          backgroundPoster="/assets/images/hero/boats.jpg"
          overlayVariant="darker"
          separator
          panels={[
            {
              name: "Brokerage & Charters",
              description: "Find your next boat or get your boat listed with Excelero.",
              thumbImage: "/assets/images/hero/boats.jpg",
              variant: "b",
              href: RouteList.Pages.Boats,
            },
          ]}
        />

        <ExceleroHero
          title="Sailing gear"
          description="Technical apparel and gear for all conditions — from coastal cruising to offshore racing."
          backgroundVideo="/assets/video/hero/3.mp4"
          backgroundPoster="/assets/images/hero/zhik.jpg"
          overlayVariant="dark"
          panels={[
            {
              name: "Elvstrom",
              description: "Sails and Premium sailwear designed for performance and comfort.",
              thumbImage: "/assets/images/hero/elvstrom.jpg",
              href: RouteList.Pages.Partners.ElvstromSailWear,
              variant: "a",
            },
            {
              name: "Zhik",
              description: "Technical gear trusted by sailors worldwide — engineered to perform.",
              thumbImage: "/assets/images/hero/zhik.jpg",
              href: RouteList.Pages.Partners.Zhik,
              variant: "b",
            },
          ]}
        />
      </HeroScrollWrapper>

      {/* <ServiceSection />
      <BoatListingCTA /> */}
      {/* <CarHomeFilter />     */}
    </>
  );
};

export default CarHomeSection;
"use client";
import React, { useEffect, useMemo, useRef } from "react";
import CarHomeFilter from "./filterSection";
import ExceleroHero from "./ExceleroHero";
import ServiceSection from "./ServiceSection";
import BoatListingCTA from "./BoatListingCTA";
import { RouteList } from "@/utils/RouteList";

const CarHomeSection = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isAnimatingRef = useRef(false);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getSections = () =>
      Array.from(container.querySelectorAll<HTMLElement>(".exelero-hero-section"));

    const scrollToIndex = (nextIndex: number) => {
      const sections = getSections();
      if (nextIndex < 0 || nextIndex >= sections.length) return;

      isAnimatingRef.current = true;
      sections[nextIndex].scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });

      window.setTimeout(() => {
        isAnimatingRef.current = false;
      }, prefersReducedMotion ? 150 : 650);
    };

    const getActiveIndex = () => {
      const sections = getSections();
      const y = window.scrollY;
      let bestIdx = 0;
      let bestDist = Number.POSITIVE_INFINITY;
      sections.forEach((s, idx) => {
        const top = s.getBoundingClientRect().top + window.scrollY;
        const dist = Math.abs(top - y);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });
      return bestIdx;
    };

    const wheelAccumRef = { value: 0 };
    const lastWheelTsRef = { value: 0 };
    const WHEEL_RESET_MS = 180;
    const WHEEL_TRIGGER_THRESHOLD = 40; // require a bit more scroll before snapping

    const onWheel = (e: WheelEvent) => {
      if (isAnimatingRef.current) return;
      const now = Date.now();
      if (now - lastWheelTsRef.value > WHEEL_RESET_MS) {
        wheelAccumRef.value = 0;
      }
      lastWheelTsRef.value = now;

      // Only when the wheel target is within this hero stack
      const target = e.target as HTMLElement | null;
      if (!target || !container.contains(target)) return;

      // accumulate deltas so small trackpad scroll doesn't instantly snap
      wheelAccumRef.value += e.deltaY;
      if (Math.abs(wheelAccumRef.value) < WHEEL_TRIGGER_THRESHOLD) return;

      e.preventDefault();
      const dir = wheelAccumRef.value > 0 ? 1 : -1;
      wheelAccumRef.value = 0;
      const idx = getActiveIndex();
      scrollToIndex(idx + dir);
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (!container.contains(e.target as Node)) return;
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (isAnimatingRef.current) return;
      if (!container.contains(e.target as Node)) return;
      const endY = (e.changedTouches[0]?.clientY ?? 0);
      const delta = touchStartY - endY;
      if (Math.abs(delta) < 40) return;
      const dir = delta > 0 ? 1 : -1;
      const idx = getActiveIndex();
      scrollToIndex(idx + dir);
    };

    // non-passive so preventDefault works
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    const updateHeaderTransparency = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // "in hero": the hero stack occupies the viewport (at least partially)
      const inHero = rect.top <= 0 && rect.bottom >= 80;
      document.body.classList.toggle("hero-header-transparent", inHero);
    };

    updateHeaderTransparency();
    window.addEventListener("scroll", updateHeaderTransparency, { passive: true });
    window.addEventListener("resize", updateHeaderTransparency, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel as any);
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchend", onTouchEnd as any);
      window.removeEventListener("scroll", updateHeaderTransparency as any);
      window.removeEventListener("resize", updateHeaderTransparency as any);
      document.body.classList.remove("hero-header-transparent");
    };
  }, [prefersReducedMotion]);

  return (
    <>
      <div className="exelero-hero-scroll" ref={containerRef}>
        <ExceleroHero
          title="X‑Yachts & Elvstrom Sails"
          subtitle="Performance yachts & premium sails"
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
              name: "Elvstrom Sails",
              description: "Premium sails and sail solutions for cruising and racing.",
              thumbImage: "/assets/images/hero/elvstrom.jpg",
              href: RouteList.Pages.Services.Sails,
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
          title="Elvstrom SailWear & Zhik"
          description="Technical apparel and gear for all conditions — from coastal cruising to offshore racing."
          backgroundVideo="/assets/video/hero/3.mp4"
          backgroundPoster="/assets/images/hero/zhik.jpg"
          overlayVariant="dark"
          panels={[
            {
              name: "Elvstrom SailWear",
              description: "Premium sailwear designed for performance and comfort.",
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
      </div>

      {/* <ServiceSection />
      <BoatListingCTA /> */}
      {/* <CarHomeFilter />     */}
    </>
  );
};

export default CarHomeSection;
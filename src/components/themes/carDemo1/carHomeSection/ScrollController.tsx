"use client";
import { useEffect, useMemo, useRef } from "react";

interface ScrollControllerProps {
  containerRef: React.RefObject<HTMLDivElement>;
  sectionSelector?: string;
}

export const ScrollController = ({
  containerRef,
  sectionSelector = ".exelero-hero-section",
}: ScrollControllerProps) => {
  const isAnimatingRef = useRef(false);
  const lastScrollTimeRef = useRef(0);
  const accumulatedDeltaRef = useRef(0);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getSections = () =>
      Array.from(container.querySelectorAll<HTMLElement>(sectionSelector));

    const scrollToSection = (section: HTMLElement) => {
      const top = section.offsetTop;
      isAnimatingRef.current = true;

      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });

      setTimeout(() => {
        isAnimatingRef.current = false;
        accumulatedDeltaRef.current = 0;
      }, prefersReducedMotion ? 100 : 700);
    };

    const getCurrentSectionIndex = () => {
      const sections = getSections();
      const scrollY = window.scrollY;
      const viewportMiddle = scrollY + window.innerHeight / 2;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (viewportMiddle >= sectionTop && viewportMiddle < sectionBottom) {
          return i;
        }
      }

      // If below all sections, return last index
      return sections.length - 1;
    };

    const isAtLastSection = () => {
      const sections = getSections();
      return getCurrentSectionIndex() === sections.length - 1;
    };

    const isInHeroContainer = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Check if we're within the hero container area
      return rect.top < viewportHeight && rect.bottom > 0;
    };

    const handleWheel = (e: WheelEvent) => {
      // Allow normal scrolling if not in hero container
      if (!isInHeroContainer()) return;

      const target = e.target as HTMLElement | null;
      if (!target || !container.contains(target)) return;

      // If animating, prevent all scrolling
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }

      const sections = getSections();
      const currentIndex = getCurrentSectionIndex();
      const now = Date.now();

      // Reset accumulated delta if too much time has passed
      if (now - lastScrollTimeRef.current > 150) {
        accumulatedDeltaRef.current = 0;
      }
      lastScrollTimeRef.current = now;

      // Accumulate delta
      accumulatedDeltaRef.current += e.deltaY;

      // Threshold for triggering section change
      const DELTA_THRESHOLD = 100;

      // Scrolling down
      if (accumulatedDeltaRef.current > DELTA_THRESHOLD) {
        // If at last section, allow normal scroll
        if (currentIndex === sections.length - 1) {
          return;
        }

        e.preventDefault();
        const nextIndex = Math.min(currentIndex + 1, sections.length - 1);
        scrollToSection(sections[nextIndex]);
      }
      // Scrolling up
      else if (accumulatedDeltaRef.current < -DELTA_THRESHOLD) {
        e.preventDefault();
        const prevIndex = Math.max(currentIndex - 1, 0);
        scrollToSection(sections[prevIndex]);
      }
      // Within threshold - prevent default to stop native scroll
      else if (Math.abs(e.deltaY) > 0 && currentIndex < sections.length - 1) {
        e.preventDefault();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (!container.contains(e.target as Node)) return;
      touchStartY = e.touches[0]?.clientY ?? 0;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimatingRef.current) return;
      if (!container.contains(e.target as Node)) return;
      if (!isInHeroContainer()) return;

      const endY = e.changedTouches[0]?.clientY ?? 0;
      const delta = touchStartY - endY;
      const SWIPE_THRESHOLD = 50;

      if (Math.abs(delta) < SWIPE_THRESHOLD) return;

      const sections = getSections();
      const currentIndex = getCurrentSectionIndex();

      // Swipe up (scroll down)
      if (delta > 0) {
        if (currentIndex === sections.length - 1) return;
        const nextIndex = Math.min(currentIndex + 1, sections.length - 1);
        scrollToSection(sections[nextIndex]);
      }
      // Swipe down (scroll up)
      else {
        const prevIndex = Math.max(currentIndex - 1, 0);
        scrollToSection(sections[prevIndex]);
      }
    };

    const updateHeaderTransparency = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const inHero = rect.top <= 0 && rect.bottom >= 80;
      document.body.classList.toggle("hero-header-transparent", inHero);
    };

    // Event listeners
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("scroll", updateHeaderTransparency, { passive: true });
    window.addEventListener("resize", updateHeaderTransparency, { passive: true });

    // Initial header state
    updateHeaderTransparency();

    return () => {
      window.removeEventListener("wheel", handleWheel as any);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("scroll", updateHeaderTransparency);
      window.removeEventListener("resize", updateHeaderTransparency);
      document.body.classList.remove("hero-header-transparent");
    };
  }, [containerRef, sectionSelector, prefersReducedMotion]);

  return null;
};
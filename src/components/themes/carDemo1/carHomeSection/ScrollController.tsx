"use client";
import { useEffect, useMemo, useRef } from "react";

interface ScrollControllerProps {
  currentIndex: number;
  totalSections: number;
  onSectionChange: (index: number) => void;
  heroRef: React.RefObject<HTMLElement>;
}

export const ScrollController = ({
  currentIndex,
  totalSections,
  onSectionChange,
  heroRef,
}: ScrollControllerProps) => {
  const isAnimatingRef = useRef(false);
  const lastScrollTimeRef = useRef(0);
  const accumulatedDeltaRef = useRef(0);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    const isHeroInFullView = () => {
      if (!heroRef.current) return false;
      const rect = heroRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Hero is in full view if it covers the entire viewport
      return rect.top <= 0 && rect.bottom >= viewportHeight;
    };

    const handleSectionChange = (newIndex: number) => {
      isAnimatingRef.current = true;
      onSectionChange(newIndex);
      
      setTimeout(() => {
        isAnimatingRef.current = false;
        accumulatedDeltaRef.current = 0;
      }, prefersReducedMotion ? 100 : 700);
    };

    const handleWheel = (e: WheelEvent) => {
      // Only apply custom scroll behavior when hero is in full view
      if (!isHeroInFullView()) {
        return;
      }

      // If animating, prevent all scrolling
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }

      const now = Date.now();

      // Reset accumulated delta if too much time has passed
      if (now - lastScrollTimeRef.current > 150) {
        accumulatedDeltaRef.current = 0;
      }
      lastScrollTimeRef.current = now;

      // Accumulate delta
      accumulatedDeltaRef.current += e.deltaY;

      // Threshold for triggering section change
      const DELTA_THRESHOLD = 250;
      // Extra hard threshold for exiting last section
      const EXIT_THRESHOLD = 600;

      // Scrolling down
      if (accumulatedDeltaRef.current > (currentIndex === totalSections - 1 ? EXIT_THRESHOLD : DELTA_THRESHOLD)) {
        // If at last section and threshold met, allow normal scroll to footer
        if (currentIndex === totalSections - 1) {
          accumulatedDeltaRef.current = 0;
          return;
        }

        e.preventDefault();
        const nextIndex = Math.min(currentIndex + 1, totalSections - 1);
        handleSectionChange(nextIndex);
      }
      // Scrolling up
      else if (accumulatedDeltaRef.current < -DELTA_THRESHOLD) {
        e.preventDefault();
        const prevIndex = Math.max(currentIndex - 1, 0);
        handleSectionChange(prevIndex);
      }
      // Within threshold - prevent default to stop native scroll
      else if (Math.abs(e.deltaY) > 0 && currentIndex < totalSections - 1) {
        e.preventDefault();
      }
      // At last section but haven't reached exit threshold
      else if (currentIndex === totalSections - 1 && e.deltaY > 0) {
        e.preventDefault();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (!isHeroInFullView()) return;
      touchStartY = e.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isHeroInFullView()) return;
      
      // Prevent default scrolling when in hero section
      if (isAnimatingRef.current || currentIndex < totalSections - 1) {
        e.preventDefault();
      }
      
      // Also prevent at last section unless we've accumulated enough delta
      if (currentIndex === totalSections - 1) {
        const currentY = e.touches[0]?.clientY ?? 0;
        const delta = touchStartY - currentY;
        const EXIT_SWIPE_THRESHOLD = 200;
        
        if (Math.abs(delta) < EXIT_SWIPE_THRESHOLD) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimatingRef.current) return;
      if (!isHeroInFullView()) return;

      const endY = e.changedTouches[0]?.clientY ?? 0;
      const delta = touchStartY - endY;
      const SWIPE_THRESHOLD = 100;
      const EXIT_SWIPE_THRESHOLD = 200;

      // Swipe up (scroll down)
      if (delta > 0) {
        if (currentIndex === totalSections - 1) {
          // Need extra strong swipe to exit to footer
          if (Math.abs(delta) < EXIT_SWIPE_THRESHOLD) {
            e.preventDefault();
            return;
          }
          return; // Allow scroll to footer
        }
        
        if (Math.abs(delta) < SWIPE_THRESHOLD) return;
        e.preventDefault();
        const nextIndex = Math.min(currentIndex + 1, totalSections - 1);
        handleSectionChange(nextIndex);
      }
      // Swipe down (scroll up)
      else {
        if (Math.abs(delta) < SWIPE_THRESHOLD) return;
        e.preventDefault();
        const prevIndex = Math.max(currentIndex - 1, 0);
        handleSectionChange(prevIndex);
      }
    };

    // Event listeners
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel as any);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove as any);
      window.removeEventListener("touchend", handleTouchEnd as any);
    };
  }, [currentIndex, totalSections, onSectionChange, prefersReducedMotion, heroRef]);

  return null;
};
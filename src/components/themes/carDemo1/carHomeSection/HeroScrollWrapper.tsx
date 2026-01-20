
"use client";
import React, { useRef } from "react";
import { ScrollController } from "./ScrollController";

interface HeroScrollWrapperProps {
  children: React.ReactNode;
}

export const HeroScrollWrapper = ({ children }: HeroScrollWrapperProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <ScrollController containerRef={containerRef} />
      <div className="exelero-hero-scroll" ref={containerRef}>
        {children}
      </div>
    </>
  );
};
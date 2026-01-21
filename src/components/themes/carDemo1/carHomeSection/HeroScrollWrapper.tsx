
"use client";
import React from "react";

interface HeroScrollWrapperProps {
  children: React.ReactNode;
}

// Simplified wrapper to avoid unused controller/type issues.
export const HeroScrollWrapper = ({ children }: HeroScrollWrapperProps) => {
  return <div className="exelero-hero-scroll">{children}</div>;
};
"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "reactstrap";
import { ScrollController } from "./ScrollController";

export type HeroPanel = {
  name: string;
  description: string;
  thumbImage: string;
  href: string;
  variant?: "a" | "b";
};

export interface HeroSection {
  title: string;
  subtitle?: string;
  description?: string;
  panels: HeroPanel[];
  overlayVariant?: "dark" | "darker";
}

export interface DynamicExceleroHeroProps {
  backgroundVideo?: string;
  backgroundPoster?: string;
  sections: HeroSection[];
}

const DynamicExceleroHero = ({
  backgroundVideo,
  backgroundPoster = "/assets/images/hero/main2.png",
  sections,
}: DynamicExceleroHeroProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const heroRef = useRef<HTMLElement | null>(null);
  const currentSection = sections[currentIndex];

  return (
    <>
      <ScrollController
        currentIndex={currentIndex}
        totalSections={sections.length}
        onSectionChange={setCurrentIndex}
        heroRef={heroRef}
      />
      
      <section
        ref={heroRef}
        className={`exelero-hero-section ${"overlay-dark"}`}
        style={{ 
          minHeight: "100vh",
          position: "relative",
          transition: "background-color 0.5s ease"
        }}
      >
        <div className="hero-background" aria-hidden="true">
          {backgroundVideo ? (
            <video 
              className="hero-bg-video" 
              autoPlay 
              muted 
              loop 
              playsInline 
              preload="auto" 
              poster={backgroundPoster}
            >
              <source src={backgroundVideo} type="video/mp4" />
            </video>
          ) : (
            <Image 
              src={backgroundPoster} 
              alt="" 
              fill 
              className="hero-bg-image" 
              style={{ objectFit: "cover" }} 
              priority 
            />
          )}
          <div className="hero-overlay"></div>
        </div>

        <Container>
          <div className="hero-content" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div 
              className="hero-header"
              key={`header-${currentIndex}`}
              data-aos="fade-up" 
              data-aos-duration={500}
            >
              <h1 className="hero-title">{currentSection.title}</h1>
              {/* {currentSection.subtitle && (
                <h2 className="hero-subtitle">{currentSection.subtitle}</h2>
              )}
              {currentSection.description && (
                <p className="hero-description">{currentSection.description}</p>
              )} */}
            </div>

            <div 
              className={`geo-panels ${currentSection.panels.length === 1 ? "geo-panels--single" : ""}`}
              style={{ display: "flex", justifyContent: "center" }}
              key={`panels-${currentIndex}`}
            >
              {currentSection.panels.map((panel, idx) => {
                const variantClass = panel.variant === "a" ? "geo-panel--a" : "geo-panel--b";

                return (
                  <Link
                    key={`${panel.name}-${idx}`}
                    href={panel.href}
                    className="geo-panel geo-panel--glass"
                    data-aos="fade-up"
                    data-aos-duration={500 + idx * 150}
                  >
                    <div className={`geo-thumb ${variantClass}`}>
                      <Image 
                        src={panel.thumbImage} 
                        alt={panel.name} 
                        fill 
                        className="geo-thumb-img" 
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <h3 className="geo-title">{panel.name}</h3>
                  </Link>
                );
              })}
            </div>

            {/* Section indicators */}
            <div 
              style={{
                position: "absolute",
                bottom: "2rem",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "0.5rem",
                zIndex: 10
              }}
            >
              {sections.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    width: idx === currentIndex ? "2rem" : "0.5rem",
                    height: "0.5rem",
                    borderRadius: "0.25rem",
                    border: "none",
                    backgroundColor: idx === currentIndex ? "white" : "rgba(255, 255, 255, 0.4)",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                  aria-label={`Go to section ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default DynamicExceleroHero;
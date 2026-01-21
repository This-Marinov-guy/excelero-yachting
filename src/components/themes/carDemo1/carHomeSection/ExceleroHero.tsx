import Image from "next/image";
import Link from "next/link";
import { Container } from "reactstrap";

export type HeroPanel = {
  name: string;
  description: string;
  thumbImage: string;
  href: string;
  variant?: "a" | "b";
};

export interface ExceleroHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundVideo?: string;
  backgroundPoster?: string;
  overlayVariant?: "dark" | "darker";
  panels: HeroPanel[];
  single?: boolean;
  separator?: boolean;
}

const ExceleroHero = ({
  title,
  subtitle,
  description,
  backgroundVideo,
  backgroundPoster = "/assets/images/hero/main2.png",
  overlayVariant = "dark",
  panels,
  single,
  separator,
}: ExceleroHeroProps) => {
  return (
    <section
      className={`exelero-hero-section ${overlayVariant === "darker" ? "overlay-darker" : "overlay-dark"} ${separator ? "has-separator" : ""}`}
    >
      <div className="hero-background" aria-hidden="true">
        {backgroundVideo ? (
          <video className="hero-bg-video" autoPlay muted loop playsInline preload="auto" poster={backgroundPoster}>
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        ) : (
          <Image src={backgroundPoster} alt="" fill className="hero-bg-image" style={{ objectFit: "cover" }} priority />
        )}
        <div className="hero-overlay"></div>
      </div>

      <Container>
        <div className="hero-content" data-aos="fade-up" data-aos-duration={700}>
          <div className="hero-header">
            <h1 className="hero-title">{title}</h1>
            {subtitle && <h2 className="hero-subtitle">{subtitle}</h2>}
            {description && <p className="hero-description">{description}</p>}
          </div>

          <div className={`geo-panels ${single ? "geo-panels--single" : ""}`} style={{display: "flex", justifyContent: "center", overflowY: "hidden"}}>
            {panels.map((panel, idx) => {
              const variantClass = panel.variant === "a" ? "geo-panel--a" : "geo-panel--b";

              return (
                <Link
                  key={`${panel.name}-${idx}`}
                  href={panel.href}
                  className={`geo-panel ${variantClass}`}
                  data-aos="fade-up"
                  data-aos-duration={500 + idx * 150}
                  style={{ overflowY: "hidden" }}
                >
                  <div className="geo-thumb" aria-hidden="true">
                    <Image src={panel.thumbImage} alt={panel.name} fill className="geo-thumb-img" style={{ objectFit: "cover" }} />
                  </div>

                  <div className="geo-content">
                    <h3 className="geo-title">{panel.name}</h3>
                    <p className="geo-text">{panel.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ExceleroHero;

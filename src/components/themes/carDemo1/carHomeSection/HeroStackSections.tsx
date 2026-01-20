import Image from "next/image";
import Link from "next/link";
import { Container } from "reactstrap";
import { RouteList } from "@/utils/RouteList";

type Panel =
  | {
      kind: "link";
      eyebrow?: string;
      name: string;
      description: string;
      thumbImage: string;
      logoImage: string;
      href: string;
      variant?: "a" | "b";
    }
  | {
      kind: "composite";
      eyebrow?: string;
      name: string;
      description: string;
      thumbImage: string;
      logos: Array<{ src: string; alt: string }>;
      actions: Array<{ href: string; label: string }>;
      variant?: "a" | "b";
    };

interface HeroSlab {
  id: string;
  title: string;
  description?: string;
  backgroundVideo?: string;
  backgroundPoster?: string;
  overlayVariant?: "dark" | "darker";
  panels: Panel[];
  single?: boolean;
}

const HeroStackSections = () => {
  const slabs: HeroSlab[] = [
    {
      id: "slab-partners-sails",
      title: "X‑Yachts & Elvstrom Sails",
      backgroundVideo: "/assets/video/hero/2.mp4",
      backgroundPoster: "/assets/images/hero/x-yachts.jpg",
      overlayVariant: "dark",
      panels: [
        {
          kind: "link",
          eyebrow: "Brand Partner",
          name: "X‑Yachts",
          description: "Performance sailing yachts built with Scandinavian precision.",
          thumbImage: "/assets/images/hero/x-yachts.jpg",
          logoImage: "/assets/images/logo/x-yachts.png",
          href: RouteList.Pages.Partners.XYachts,
          variant: "a",
        },
        {
          kind: "link",
          eyebrow: "Service",
          name: "Elvstrom Sails",
          description: "Premium sails and sail solutions for cruising and racing.",
          thumbImage: "/assets/images/hero/elvstrom.jpg",
          logoImage: "/assets/images/logo/elvstrom.jpg",
          href: RouteList.Pages.Services.Sails,
          variant: "b",
        },
      ],
    },
    {
      id: "slab-brokerage-charters",
      title: "Brokerage & Charters",
      description: "Find your next boat — or let us handle brokerage and charter listings end‑to‑end.",
      backgroundVideo: "/assets/video/hero/3.mp4",
      backgroundPoster: "/assets/images/hero/boats.jpg",
      overlayVariant: "darker",
      single: true,
      panels: [
        {
          kind: "composite",
          eyebrow: "Marketplace",
          name: "Brokerage & Charters",
          description: "Browse listings, request brokerage support, or list your boat for charter.",
          thumbImage: "/assets/images/hero/boats.jpg",
          logos: [
            { src: "/assets/images/favicons/favicon.ico", alt: "Excelero" },
            { src: "/assets/images/logo/x-yachts.png", alt: "X‑Yachts" },
          ],
          actions: [
            { href: RouteList.Pages.Boats, label: "Brokerage" },
            { href: RouteList.Pages.Services.Charters, label: "Charters" },
          ],
          variant: "b",
        },
      ],
    },
    {
      id: "slab-apparel",
      title: "Technical Apparel",
      description: "High‑performance sailwear and technical gear for all conditions.",
      backgroundPoster: "/assets/images/hero/zhik.jpg",
      overlayVariant: "dark",
      panels: [
        {
          kind: "link",
          eyebrow: "Partner",
          name: "Elvstrom SailWear",
          description: "Premium sailing apparel designed for performance and comfort.",
          thumbImage: "/assets/images/hero/elvstrom.jpg",
          logoImage: "/assets/images/logo/elvstrom-sailwear.webp",
          href: RouteList.Pages.Partners.ElvstromSailWear,
          variant: "a",
        },
        {
          kind: "link",
          eyebrow: "Partner",
          name: "Zhik",
          description: "Technical gear trusted by sailors worldwide — engineered to perform.",
          thumbImage: "/assets/images/hero/zhik.jpg",
          logoImage: "/assets/images/logo/zhik.jpg",
          href: RouteList.Pages.Partners.Zhik,
          variant: "b",
        },
      ],
    },
  ];

  return (
    <div className="exelero-hero-stack">
      {slabs.map((slab, slabIdx) => (
        <section
          key={slab.id}
          id={slab.id}
          className={`exelero-hero-slab ${slab.single ? "is-single" : ""} ${slab.overlayVariant === "darker" ? "overlay-darker" : "overlay-dark"}`}
        >
          <div className="slab-background" aria-hidden="true">
            {slab.backgroundVideo ? (
              <video
                className="slab-bg-video"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={slab.backgroundPoster || "/assets/images/hero/main2.png"}
              >
                <source src={slab.backgroundVideo} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={slab.backgroundPoster || "/assets/images/hero/main2.png"}
                alt=""
                fill
                className="slab-bg-image"
                style={{ objectFit: "cover" }}
                priority={slabIdx === 0}
              />
            )}
            <div className="slab-overlay" />
          </div>

          <Container>
            <div className="slab-content" data-aos="fade-up" data-aos-duration={700}>
              <div className="slab-header">
                <h2 className="slab-title">{slab.title}</h2>
                {slab.description && <p className="slab-description">{slab.description}</p>}
              </div>

              <div className={`geo-panels ${slab.single ? "geo-panels--single" : ""}`}>
                {slab.panels.map((panel, idx) => {
                  const variantClass = panel.variant === "a" ? "geo-panel--a" : "geo-panel--b";

                  if (panel.kind === "link") {
                    return (
                      <Link
                        key={`${slab.id}-${panel.name}`}
                        href={panel.href}
                        className={`geo-panel ${variantClass}`}
                        data-aos="fade-up"
                        data-aos-duration={500 + idx * 150}
                      >
                        <div className="geo-thumb" aria-hidden="true">
                          <Image src={panel.thumbImage} alt="" fill className="geo-thumb-img" style={{ objectFit: "cover" }} />
                        </div>

                        <div className="geo-content">
                          <div className="geo-top">
                            <div className="geo-logo">
                              <Image
                                src={panel.logoImage}
                                alt={`${panel.name} logo`}
                                width={160}
                                height={90}
                                className="geo-logo-img"
                                style={{ objectFit: "contain" }}
                              />
                            </div>
                            {panel.eyebrow && <span className="geo-eyebrow">{panel.eyebrow}</span>}
                          </div>

                          <h3 className="geo-title">{panel.name}</h3>
                          <p className="geo-text">{panel.description}</p>

                          <span className="geo-cta">
                            Explore <i className="ri-arrow-right-line" />
                          </span>
                        </div>
                      </Link>
                    );
                  }

                  return (
                    <div
                      key={`${slab.id}-${panel.name}`}
                      className={`geo-panel geo-panel--wide ${variantClass}`}
                      data-aos="fade-up"
                      data-aos-duration={500 + idx * 150}
                    >
                      <div className="geo-thumb" aria-hidden="true">
                        <Image src={panel.thumbImage} alt="" fill className="geo-thumb-img" style={{ objectFit: "cover" }} />
                      </div>

                      <div className="geo-content">
                        <div className="geo-top">
                          <div className="geo-logos">
                            {panel.logos.map((l) => (
                              <div className="geo-logo" key={l.alt}>
                                <Image
                                  src={l.src}
                                  alt={l.alt}
                                  width={150}
                                  height={84}
                                  className="geo-logo-img"
                                  style={{ objectFit: "contain" }}
                                />
                              </div>
                            ))}
                          </div>
                          {panel.eyebrow && <span className="geo-eyebrow">{panel.eyebrow}</span>}
                        </div>

                        <h3 className="geo-title">{panel.name}</h3>
                        <p className="geo-text">{panel.description}</p>

                        <div className="geo-actions">
                          {panel.actions.map((a) => (
                            <Link key={a.href} href={a.href} className="geo-action">
                              {a.label} <i className="ri-arrow-right-line" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Container>
        </section>
      ))}
    </div>
  );
};

export default HeroStackSections;


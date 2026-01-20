import Image from "next/image";
import Link from "next/link";
import { Col, Container, Row } from "reactstrap";
import { RouteList } from "@/utils/RouteList";

interface BrandPanel {
  name: string;
  heroImage: string;
  logoImage: string;
  link: string;
}

const ExceleroHero = () => {
  const brands: BrandPanel[] = [
    {
      name: "Omaya Yachts",
      heroImage: "/assets/images/hero/omaya-yachts.jpg",
      logoImage: "/assets/images/logo/omaya-yachts.jpg",
      link: RouteList.Pages.Partners.OmayaYachts,
    },
    {
      name: "Broker Market",
      heroImage: "/assets/images/hero/boats.jpg",
      logoImage: "/assets/images/favicons/favicon.ico",
      link: RouteList.Pages.Boats,
    },
    {
      name: "X-Yachts",
      heroImage: "/assets/images/hero/x-yachts.jpg",
      logoImage: "/assets/images/logo/x-yachts.png",
      link: RouteList.Pages.Partners.XYachts,
    },
    {
      name: "Elvstrom",
      heroImage: "/assets/images/hero/elvstrom.jpg",
      logoImage: "/assets/images/logo/elvstrom.jpg",
      link: RouteList.Pages.Partners.Elvstrom,
    },
  ];

  return (
    <div className="exelero-hero-section">
      <div className="hero-background">
        <Image
          src="/assets/images/hero/main2.png"
          alt="Exelero Yachting"
          fill
          className="hero-bg-image"
          priority
          style={{ objectFit: "cover" }}
        />
        <div className="hero-overlay"></div>
      </div>
      <Container>
        <div className="hero-content">
          <h1 className="hero-title">Exelero Group</h1>
          <h2 className="hero-subtitle">Yachting and more</h2>
          <Row className="hero-panels g-3 g-md-4">
            {brands.map((brand, index) => (
              <Col xl={3} lg={3} md={6} sm={6} xs={12} key={index}>
                <Link href={brand.link} className="hero-panel">
                  <div className="panel-image-wrapper">
                    <Image
                      src={brand.heroImage}
                      alt={brand.name}
                      fill
                      className="panel-image"
                      style={{ objectFit: "cover" }}
                    />
                    <div className="panel-overlay"></div>
                    <div className="panel-logo">
                      <Image
                        src={brand.logoImage}
                        alt={`${brand.name} logo`}
                        width={150}
                        height={80}
                        className="logo-img"
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  </div>
                  <h3 className="panel-title">{brand.name}</h3>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default ExceleroHero;

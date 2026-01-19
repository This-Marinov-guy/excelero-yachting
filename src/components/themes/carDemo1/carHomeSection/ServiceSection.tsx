"use client";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "next/link";
import { Col, Container, Row } from "reactstrap";
import CommonHeader from "../../common/CommonHeader";

interface Service {
  title: string;
  icon: string;
  image: string;
  link: string;
  description: string;
}

const ServiceSection = () => {
  const services: Service[] = [
    {
      title: "Sails",
      icon: "ri-sailboat-line",
      image: "/assets/images/car/featured/1.jpg",
      link: RouteList.Pages.Services.Sails,
      description: "Premium sailing equipment and accessories for optimal performance on the water.",
    },
    {
      title: "Clothes",
      icon: "ri-shirt-line",
      image: "/assets/images/car/featured/2.jpg",
      link: RouteList.Pages.Services.Clothes,
      description: "High-quality sailing apparel designed for comfort, durability, and style.",
    },
    {
      title: "Boats",
      icon: "ri-ship-line",
      image: "/assets/images/car/featured/3.jpg",
      link: RouteList.Pages.Services.Boats,
      description: "Explore our curated selection of luxury yachts and boats for every need.",
    },
    {
      title: "Transportation",
      icon: "ri-truck-line",
      image: "/assets/images/car/featured/4.jpg",
      link: RouteList.Pages.Services.Transportation,
      description: "Professional boat transportation services worldwide with expert handling.",
    },
    {
      title: "Sell Your Boat",
      icon: "ri-exchange-line",
      image: "/assets/images/car/featured/5.jpg",
      link: RouteList.Pages.Services.SellYourBoat,
      description: "Expert assistance in selling your vessel at the best market price.",
    },
    {
      title: "Charters",
      icon: "ri-ship-2-line",
      image: "/assets/images/car/featured/6.jpg",
      link: RouteList.Pages.Services.Charters,
      description: "Luxury yacht charters for unforgettable sailing experiences and adventures.",
    },
    {
      title: "Parts",
      icon: "ri-tools-line",
      image: "/assets/images/car/featured/7.jpg",
      link: RouteList.Pages.Services.Parts,
      description: "Genuine parts and accessories for yacht maintenance and performance upgrades.",
    },
  ];

  return (
    <section className="excelero-services-section section-t-space section-b-space">
      <Container>
        <CommonHeader 
          title="Our Services" 
          content="Excelero Yachting offers comprehensive yachting services to meet all your maritime needs. From premium equipment to expert consultation, we provide end-to-end solutions for yacht owners and sailing enthusiasts." 
          headClass="title-style-2" 
          animation 
        />
        <Row className="g-4 g-md-5">
          {services.map((service, index) => (
            <Col lg={4} md={6} sm={6} key={index}>
              <Link href={service.link} className="excelero-service-card">
                <div className="service-image-wrapper">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="service-image"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="service-image-overlay"></div>
                  <div className="service-icon-wrapper">
                    <div className="service-icon">
                      <i className={service.icon} />
                    </div>
                  </div>
                </div>
                <div className="service-content">
                  <h4>{service.title}</h4>
                  <p>{service.description}</p>
                </div>
                <div className="service-arrow">
                  <i className="ri-arrow-right-line" />
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default ServiceSection;

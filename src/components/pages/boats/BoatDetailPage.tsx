"use client";

import { ProductType } from "@/types/Product";
import { FC } from "react";
import { Container, Row, Col } from "reactstrap";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useState } from "react";
import { Button } from "reactstrap";
import Link from "next/link";
import { Href } from "@/constants";
import DOMPurify from "dompurify";

interface BoatDetailPageProps {
  boat: ProductType;
}

const BoatDetailPage: FC<BoatDetailPageProps> = ({ boat }) => {
  const [saveBoat, setSaveBoat] = useState<boolean>(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const sanitizeHTML = (html: string): string => {
    if (!html || typeof html !== "string") return "";
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "s", "h1", "h2", "h3", "ul", "ol", "li", "a", "span", "div"],
      ALLOWED_ATTR: ["href", "target", "rel", "style", "class", "color"],
    });
  };

  return (
    <>
      <Breadcrumbs title={boat.title} url={RouteList.Home.CarDemo1} subTitle="Boats" />
      
      <div className="section-b-space boat-detail-section">
        <Container>
          {/* Main Detail Header */}
          <div className="boat-detail-main mb-4">
            <div className="main-detail-flex">
              <div>
                <h3>{boat.title}</h3>
                <h6>{boat.location}</h6>
                <div className="label-flex">
                  <label className="detail-label">
                    {boat.boatType === "racer" ? "Racer" : boat.boatType === "cruiser" ? "Cruiser" : "For Sale"}
                  </label>
                  {boat.manufacturer && (
                    <label className="detail-label ms-2">{boat.manufacturer}</label>
                  )}
                </div>
              </div>
              <div className="price-box">
                <h4>
                  {formatPrice(boat.price || 0)} <span style={{ fontFamily: "Satisfy" }}>€</span>
                  {boat.vatIncluded && <span className="text-muted small ms-2">(VAT Included)</span>}
                </h4>
                <ul className="detail-social-list">
                  <li>
                    <Link scroll={false} href={Href} onClick={() => window.print()}>
                      <i className="ri-printer-line" />
                      Print
                    </Link>
                  </li>
                  <li>
                    <Link
                      scroll={false}
                      href={Href}
                      className={`${saveBoat ? "clicked" : ""} add-to-fav`}
                      onClick={() => setSaveBoat(!saveBoat)}
                    >
                      {!saveBoat ? <i className="ri-bookmark-line save-outline" /> : <i className="ri-bookmark-fill save-icon" />}
                      Save
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <Row className="gx-4">
            {/* Left Column - Images and Details */}
            <Col xl={9} lg={8}>
              {/* Image Slider */}
              {boat.image && boat.image.length > 0 && (
                <div className="boat-detail-images mb-4">
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    spaceBetween={10}
                    slidesPerView={1}
                    className="boat-image-slider"
                  >
                    {boat.image.map((img, index) => (
                      <SwiperSlide key={index}>
                        <div className="boat-image-wrapper" style={{ position: "relative", width: "100%", height: "600px" }}>
                          <Image
                            src={img}
                            alt={`${boat.title} - Image ${index + 1}`}
                            fill
                            style={{ objectFit: "cover" }}
                            priority={index === 0}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}

              {/* Description */}
              {boat.description && (
                <div className="boat-description mb-4">
                  <h5 className="mb-3">Description</h5>
                  <div
                    className="boat-description-content"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(boat.description) }}
                  />
                </div>
              )}

              {/* Specifications */}
              <div className="boat-specifications mb-4">
                <h5 className="mb-3">Specifications</h5>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="spec-item">
                      <strong>Manufacturer:</strong> <span>{boat.manufacturer || "N/A"}</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="spec-item">
                      <strong>Designer:</strong> <span>{boat.designer || "N/A"}</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="spec-item">
                      <strong>Build Number:</strong> <span>{boat.buildNumber || "N/A"}</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="spec-item">
                      <strong>Build Year:</strong> <span>{boat.buildYear || "N/A"}</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="spec-item">
                      <strong>Hull Length:</strong> <span>{boat.hullLength ? `${boat.hullLength}m` : "N/A"}</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="spec-item">
                      <strong>Waterline Length:</strong> <span>{boat.waterlineLength ? `${boat.waterlineLength}m` : "N/A"}</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="spec-item">
                      <strong>Beam:</strong> <span>{boat.beam ? `${boat.beam}m` : "N/A"}</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="spec-item">
                      <strong>Draft:</strong> <span>{boat.draft ? `${boat.draft}m` : "N/A"}</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="spec-item">
                      <strong>Ballast:</strong> <span>{boat.ballast ? `${boat.ballast}kg` : "N/A"}</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="spec-item">
                      <strong>Displacement:</strong> <span>{boat.displacement ? `${boat.displacement}kg` : "N/A"}</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="spec-item">
                      <strong>Engine Power:</strong> <span>{boat.enginePower ? `${boat.enginePower}kW` : "N/A"}</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="spec-item">
                      <strong>Fuel Tank:</strong> <span>{boat.fuelTank ? `${boat.fuelTank}L` : "N/A"}</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="spec-item">
                      <strong>Water Tank:</strong> <span>{boat.waterTank ? `${boat.waterTank}L` : "N/A"}</span>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Exterior Description */}
              {boat.exteriorDescription && (
                <div className="boat-exterior-description mb-4">
                  <h5 className="mb-3">Exterior Description</h5>
                  <div
                    className="boat-exterior-content"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(boat.exteriorDescription) }}
                  />
                </div>
              )}

              {/* Additional Details */}
              {boat.additionalDetails && (
                <div className="boat-additional-details mb-4">
                  <h5 className="mb-3">Additional Details</h5>
                  <div
                    className="boat-additional-content"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(boat.additionalDetails) }}
                  />
                </div>
              )}

              {/* Brochure Download */}
              {boat.brochure && (
                <div className="boat-brochure mb-4">
                  <h5 className="mb-3">Brochure</h5>
                  <a href={boat.brochure} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                    <i className="ri-download-line me-2" />
                    Download Brochure
                  </a>
                </div>
              )}
            </Col>

            {/* Right Column - Sidebar */}
            <Col xl={3} lg={4}>
              <div className="boat-detail-sidebar">
                {/* Contact Information */}
                <div className="sidebar-box mb-4">
                  <h5 className="mb-3">Contact Information</h5>
                  
                  {boat.brokerName && (
                    <div className="contact-item mb-2">
                      <strong>Brokerage Name:</strong> <span>{boat.brokerName}</span>
                    </div>
                  )}
                  {boat.dealer && (
                    <div className="contact-item mb-2">
                      <strong>Brokerage Name:</strong> <span>{boat.dealer}</span>
                    </div>
                  )}
                  {boat.brokerEmail && (
                    <div className="contact-item mb-2">
                      <strong>Email:</strong>{" "}
                      <a href={`mailto:${boat.brokerEmail}`}>{boat.brokerEmail}</a>
                    </div>
                  )}
                  {boat.brokerPhone && (
                    <div className="contact-item mb-2">
                      <strong>Phone:</strong>{" "}
                      <a href={`tel:${boat.brokerPhone}`}>{boat.brokerPhone}</a>
                    </div>
                  )}
                  <Button className="btn-solid w-100 mt-3">
                    <i className="ri-phone-line me-2" />
                    Contact Dealer
                  </Button>
                </div>

                {/* Key Features */}
                {boat.features && boat.features.length > 0 && (
                  <div className="sidebar-box">
                    <h5 className="mb-3">Key Features</h5>
                    <ul className="feature-list">
                      {boat.features.map((feature, index) => (
                        <li key={index}>
                          <i className="ri-check-line me-2" />
                          {feature.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default BoatDetailPage;

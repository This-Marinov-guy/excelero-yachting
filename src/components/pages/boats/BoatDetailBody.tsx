"use client";

import { FC } from "react";
import { ProductType } from "@/types/Product";
import { Row, Col } from "reactstrap";
import DOMPurify from "dompurify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { Gallery, Item } from "react-photoswipe-gallery";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "photoswipe/dist/photoswipe.css";

interface BoatDetailBodyProps {
  boat: ProductType;
}

const BoatDetailBody: FC<BoatDetailBodyProps> = ({ boat }) => {
  const sanitizeHTML = (html: string): string => {
    if (!html || typeof html !== "string") return "";
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "s", "h1", "h2", "h3", "ul", "ol", "li", "a", "span", "div"],
      ALLOWED_ATTR: ["href", "target", "rel", "style", "class", "color"],
    });
  };

  // Conversion functions
  const metersToFeet = (meters: number): number => Math.round(meters * 3.28084 * 10) / 10;
  const kgToLbs = (kg: number): number => Math.round(kg * 2.20462);
  const litersToGallons = (liters: number): number => Math.round(liters * 0.264172 * 10) / 10;
  const kwToHp = (kw: number): number => Math.round(kw * 1.34102 * 10) / 10;

  const formatDualUnit = (metricValue: number | undefined, metricUnit: string, converter: (val: number) => number, imperialUnit: string): string => {
    if (!metricValue) return "N/A";
    const imperialValue = converter(metricValue);
    return `${metricValue}${metricUnit} (${imperialValue}${imperialUnit})`;
  };

  return (
    <div className="detail-body">
      {/* Image Gallery Carousel */}
      {boat.image && boat.image.length > 0 && (
        <div id="gallery" className="mb-5">
          <h4 className="detail-page-title mb-3">Gallery</h4>
          <Gallery>
            <Swiper
              modules={[Navigation, Pagination, Thumbs]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 15,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
              }}
              className="boat-gallery-carousel"
            >
              {boat.image.map((img, index) => (
                <SwiperSlide key={index}>
                  <Item
                    original={img}
                    thumbnail={img}
                    width={1200}
                    height={800}
                  >
                    {({ ref, open }) => (
                      <div
                        ref={ref}
                        className="boat-gallery-item"
                        onClick={open}
                      >
                        <Image
                          src={img}
                          alt={`${boat.title} - Image ${index + 1}`}
                          fill
                          style={{ objectFit: "cover" }}
                          className="boat-gallery-image"
                        />
                        <div className="boat-gallery-overlay">
                          <i className="ri-zoom-in-line" />
                        </div>
                      </div>
                    )}
                  </Item>
                </SwiperSlide>
              ))}
            </Swiper>
          </Gallery>
        </div>
      )}

      {/* Overview / Specifications */}
      <div id="overview" className="mb-4">
        <h4 className="detail-page-title">Specifications</h4>
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
              <strong>Hull Length:</strong> <span>{formatDualUnit(boat.hullLength, "m", metersToFeet, "ft")}</span>
            </div>
          </Col>
          <Col md={6}>
            <div className="spec-item">
              <strong>Waterline Length:</strong> <span>{formatDualUnit(boat.waterlineLength, "m", metersToFeet, "ft")}</span>
            </div>
          </Col>
          <Col md={6}>
            <div className="spec-item">
              <strong>Beam:</strong> <span>{formatDualUnit(boat.beam, "m", metersToFeet, "ft")}</span>
            </div>
          </Col>
          <Col md={6}>
            <div className="spec-item">
              <strong>Draft:</strong> <span>{formatDualUnit(boat.draft, "m", metersToFeet, "ft")}</span>
            </div>
          </Col>
          <Col md={6}>
            <div className="spec-item">
              <strong>Ballast:</strong> <span>{formatDualUnit(boat.ballast, "kg", kgToLbs, "lbs")}</span>
            </div>
          </Col>
          <Col md={6}>
            <div className="spec-item">
              <strong>Displacement:</strong> <span>{formatDualUnit(boat.displacement, "kg", kgToLbs, "lbs")}</span>
            </div>
          </Col>
          <Col md={6}>
            <div className="spec-item">
              <strong>Engine Power:</strong> <span>{formatDualUnit(boat.enginePower, "kW", kwToHp, "hp")}</span>
            </div>
          </Col>
          <Col md={6}>
            <div className="spec-item">
              <strong>Fuel Tank:</strong> <span>{formatDualUnit(boat.fuelTank, "L", litersToGallons, "gal")}</span>
            </div>
          </Col>
          <Col md={6}>
            <div className="spec-item">
              <strong>Water Tank:</strong> <span>{formatDualUnit(boat.waterTank, "L", litersToGallons, "gal")}</span>
            </div>
          </Col>
        </Row>
      </div>

      {/* Description */}
      {boat.description && (
        <div id="description" className="mb-4">
          <h4 className="detail-page-title">Description</h4>
          <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(boat.description) }} />
        </div>
      )}

      {/* Exterior Description */}
      {boat.exteriorDescription && (
        <div id="exterior" className="mb-4">
          <h4 className="detail-page-title">Exterior Description</h4>
          <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(boat.exteriorDescription) }} />
        </div>
      )}

      {/* Additional Details */}
      {boat.additionalDetails && boat.additionalDetails.length > 10 && (
        <div id="additional" className="mb-4">
          <h4 className="detail-page-title">Additional Details</h4>
          <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(boat.additionalDetails) }} />
        </div>
      )}

      {/* Brochure Download */}
      {boat.brochure && (
        <div id="brochure" className="mb-4">
          <h4 className="detail-page-title">Brochure</h4>
          <a href={boat.brochure} target="_blank" rel="noopener noreferrer" className="btn-solid">
            Download Brochure
          </a>
        </div>
      )}
    </div>
  );
};

export default BoatDetailBody;

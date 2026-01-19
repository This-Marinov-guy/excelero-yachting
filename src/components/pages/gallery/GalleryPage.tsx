"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import { RouteList } from "@/utils/RouteList";
import { GalleryEvents } from "@/data/pages/Gallery";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";

const GalleryPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const event = selectedEvent ? GalleryEvents.find((e) => e.id === selectedEvent) : null;

  return (
    <>
      <Breadcrumbs title="Gallery" url={RouteList.Home.CarDemo1} mainClass="page-breadcrumbs-section" image />
      <section className="section-b-space gallery-section">
        <Container>
          {!selectedEvent ? (
            <>
              <div className="gallery-header text-center mb-5">
                <h2 className="gallery-title">Event Gallery</h2>
                <p className="gallery-subtitle">Explore our collection of events and moments</p>
              </div>
              <Row className="g-4">
                {GalleryEvents.map((event) => (
                  <Col lg={4} md={6} sm={6} key={event.id}>
                    <div
                      className="gallery-event-card"
                      onClick={() => setSelectedEvent(event.id)}
                    >
                      <div className="event-thumbnail-wrapper">
                        <Image
                          src={event.thumbnail}
                          alt={event.title}
                          fill
                          className="event-thumbnail"
                          style={{ objectFit: "cover" }}
                          unoptimized
                        />
                        <div className="event-overlay">
                          <div className="event-info">
                            <h3 className="event-title">{event.title}</h3>
                            {event.description && (
                              <p className="event-description">{event.description}</p>
                            )}
                            {event.date && <span className="event-date">{event.date}</span>}
                            <span className="event-count">{event.images.length} photos</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </>
          ) : (
            <>
              <div className="gallery-header mb-4">
                <button
                  className="btn-back"
                  onClick={() => setSelectedEvent(null)}
                >
                  ← Back to Gallery
                </button>
                <h2 className="gallery-title mt-3">{event?.title}</h2>
                {event?.description && (
                  <p className="gallery-subtitle">{event.description}</p>
                )}
              </div>
              <Gallery>
                <Row className="g-3">
                  {event?.images.map((image) => (
                    <Col lg={4} md={6} sm={6} key={image.id}>
                      <Item
                        original={image.src}
                        thumbnail={image.src}
                        width={image.width || 1200}
                        height={image.height || 800}
                      >
                        {({ ref, open }) => (
                          <div
                            ref={ref}
                            className="gallery-image-wrapper"
                            onClick={open}
                          >
                            <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              className="gallery-image"
                              style={{ objectFit: "cover" }}
                              unoptimized
                            />
                            <div className="image-overlay">
                              <i className="ri-zoom-in-line"></i>
                            </div>
                          </div>
                        )}
                      </Item>
                    </Col>
                  ))}
                </Row>
              </Gallery>
            </>
          )}
        </Container>
      </section>
    </>
  );
};

export default GalleryPage;

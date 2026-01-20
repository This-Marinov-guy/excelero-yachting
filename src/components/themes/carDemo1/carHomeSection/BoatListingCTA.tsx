"use client";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "next/link";
import { Button, Col, Container, Row } from "reactstrap";
import { ArrowRight } from "iconsax-react";

const BoatListingCTA = () => {
  return (
    <section className="exelero-boat-listing-cta section-b-space">
      <div>
        <Image
          src="/assets/images/hero/main2.png"
          alt="Exelero Yachting"
          fill
          className="cta-bg-image"
          style={{ objectFit: "cover" }}
        />
        <div className="cta-overlay"></div>
      </div>
      <Container>
        <Row className="align-items-center">
          <Col lg={8} md={10} className="mx-auto text-center">
            <div className="cta-content">
              <h2 className="cta-title">Have a Boat to Sell or Charter?</h2>
              <p className="cta-description">
                List your vessel with Exelero Yachting and reach a global audience of yacht enthusiasts. 
                Our expert team will help you showcase your boat and connect with the right buyers or charter clients.
              </p>
              <div className="cta-buttons">
                <Link href={RouteList.Pages.Services.SellYourBoat}>
                  <Button className="btn-solid cta-btn">
                    Sell Your Boat <ArrowRight className="ms-2" size={20} />
                  </Button>
                </Link>
                <Link href={RouteList.Pages.Services.Charters}>
                  <Button className="btn-outline cta-btn">
                    List for Charter <ArrowRight className="ms-2" size={20} />
                  </Button>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default BoatListingCTA;

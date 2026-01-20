import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "next/link";
import { Col, Container, Row } from "reactstrap";

const AboutPage = () => {
  return (
    <>
      <Breadcrumbs title='About Us' url={RouteList.Home.CarDemo1} mainClass='page-breadcrumbs-section' image />

      <section className='section-b-space exelero-about-section'>
        <Container>
          <Row className='align-items-center g-4 g-lg-5'>
            <Col lg={6}>
              <div className='about-hero-image'>
                <Image
                  src='/assets/images/other/about/general.jpg'
                  alt='Exelero Yachting'
                  width={900}
                  height={700}
                  className='img-fluid about-img'
                  priority
                />
              </div>
            </Col>

            <Col lg={6}>
              <div className='about-content'>
                <h2 className='about-title'>Exelero Yachting</h2>
                <p className='about-text'>
                  Exelero Yachting is a premium yachting group focused on unforgettable experiences, trusted partnerships, and
                  best-in-class service — from sailing and charters to sourcing boats and parts.
                </p>
                <p className='about-text'>
                  We combine expertise, a curated network, and a passion for the sea to help you enjoy every mile with confidence.
                </p>

                <div className='about-highlights'>
                  <div className='highlight'>
                    <div className='highlight-icon'>
                      <i className='ri-sailboat-line' />
                    </div>
                    <div className='highlight-content'>
                      <h4>Yachting & Charter</h4>
                      <p>Hand-picked experiences and the right yacht for every journey.</p>
                    </div>
                  </div>

                  <div className='highlight'>
                    <div className='highlight-icon'>
                      <i className='ri-shield-check-line' />
                    </div>
                    <div className='highlight-content'>
                      <h4>Trusted Partners</h4>
                      <p>Brands and specialists we work with — quality-first.</p>
                    </div>
                  </div>

                  <div className='highlight'>
                    <div className='highlight-icon'>
                      <i className='ri-shake-hands-line' />
                    </div>
                    <div className='highlight-content'>
                      <h4>Full Support</h4>
                      <p>From sails to transportation, we coordinate end-to-end.</p>
                    </div>
                  </div>
                </div>

                <div className='about-cta'>
                  <Link href={RouteList.Pages.Other.ContactUs1} className='btn-solid'>
                    Contact Us
                  </Link>
                </div>
              </div>
            </Col>
          </Row>

          <div className='about-partners'>
            <div className='content-title text-center'>
              <h2>Our Partners</h2>
              <p>We collaborate with leading brands to deliver exceptional results.</p>
            </div>

            <Row className='g-3 g-md-4 justify-content-center'>
              <Col md={4} sm={6} xs={6} className='partner-col'>
                <Link className='partner-card' href={RouteList.Pages.Partners.XYachts}>
                  <Image src='/assets/images/logo/x-yachts.png' alt='X-Yachts' width={220} height={120} className='partner-logo' />
                </Link>
              </Col>
              <Col md={4} sm={6} xs={6} className='partner-col'>
                <Link className='partner-card' href={RouteList.Pages.Partners.Elvstrom}>
                  <Image src='/assets/images/logo/elvstrom.jpg' alt='Elvstrom' width={220} height={120} className='partner-logo' />
                </Link>
              </Col>
              <Col md={4} sm={6} xs={6} className='partner-col'>
                <Link className='partner-card' href={RouteList.Pages.Partners.OmayaYachts}>
                  <Image src='/assets/images/logo/omaya-yachts.jpg' alt='Omaya Yachts' width={220} height={120} className='partner-logo' />
                </Link>
              </Col>
            </Row>
          </div>
        </Container>
      </section>
    </>
  );
};

export default AboutPage;


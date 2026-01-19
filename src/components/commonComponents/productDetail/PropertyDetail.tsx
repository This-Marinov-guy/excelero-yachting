"use client";

import { Sections } from "@/data/property";
import { PropertyDetailType } from "@/types/Product";
import UseStickyBar from "@/utils/UseStickyBar";
import { FC, Fragment, useEffect } from "react";
import { Col, Container, Nav, NavItem, NavLink, Row } from "reactstrap";
import StickySlider from "../../property/details/propertySticky/stickySlider";
import DetailBody from "./detailBody";
import DetailImages from "./detailImages/DetailImages";
import DetailSidebar from "./detailSidebar";
import MainDetail from "./mainDetail";
import RelatedProperty from "./RelatedProperty";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProductApiData } from "@/redux/reducers/ProductSlice";
import { setScrollActive } from "@/redux/reducers/LayoutSlice";

const PropertyDetail: FC<PropertyDetailType> = ({ type, mainClass, thumb }) => {
  const dispatch = useAppDispatch();
  const fix = UseStickyBar(300);
  const { scrollActive } = useAppSelector((state) => state.layout);

  useEffect(() => {
    dispatch(fetchProductApiData());
  }, [dispatch]);

  useEffect(() => {
    if (Sections?.[0]?.id) {
      dispatch(setScrollActive(Sections[0].id));
    }
  }, [dispatch]);

  return (
    <div className={`property-detail-section section-b-space ${mainClass ? mainClass : ""}`}>
      {type === "sidebar-layout" ? (
        <Fragment>
          <Container className={`${thumb ? "p-sm-0" : ""}`}>
            <DetailImages type={type} />
          </Container>
          <Container>
            <Row>
              <Col xl={9} lg={6}>
                <MainDetail />
                <DetailBody type={type} />
              </Col>
              <Col xl={3} lg={4}>
                <DetailSidebar />
              </Col>
            </Row>
            <RelatedProperty type={"property"}/>
          </Container>
        </Fragment>
      ) : type === "sticky" ? (
        <Fragment>
          <Container className='p-sm-0'>
            <div className={`sticky-tab sticky-header ${fix ? "sticky" : ""}`} id="stickyTab">
              <Nav tabs>
                {Sections.map(({ id, label }) => (
                  <NavItem key={id}>
                    <NavLink className={`${scrollActive === id ? "active" : ""}`} href={`#${id}`}>
                      {label}
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
            </div>
            <Row className='gx-xxl-5 gy-4 gy-xl-0'>
              <Col xl={6}>
                <StickySlider />
              </Col>
              <Col xl={6}>
                  <DetailBody type={type} />
              </Col>
              <RelatedProperty type={"property"}/>
            </Row>
          </Container>
        </Fragment>
      ) : (
        <Fragment>
          <div className='detail-images'>
            <Container fluid={thumb ? true : false} className={thumb ? "p-0" : ""}>
              <DetailImages type={type} thumb={thumb} />
            </Container>
          </div>
          <Container>
            <MainDetail />
            <Row>
              <Col xl={9} lg={8}>
                <DetailBody type={type} />
              </Col>
              <Col xl={3} lg={4}>
                <DetailSidebar />
              </Col>
            </Row>
            <RelatedProperty type={"property"}/>
          </Container>
        </Fragment>
      )}
    </div>
  );
};

export default PropertyDetail;

"use client";

import { FC } from "react";
import { Col, Container, Row } from "reactstrap";
import { ProductType } from "@/types/Product";
import BoatMainDetail from "./BoatMainDetail";
import BoatDetailBody from "./BoatDetailBody";
import BoatDetailSidebar from "./BoatDetailSidebar";
import BoatDetailImages from "./BoatDetailImages";

interface BoatDetailProps {
  boat: ProductType;
}

const BoatDetail: FC<BoatDetailProps> = ({ boat }) => {
  return (
    <div className="property-detail-section section-b-space property-sidebar-section section-t-space ratio_30">
      <Container>
        <BoatDetailImages boat={boat} />
      </Container>
      <Container>
        <Row>
          <Col xl={9} lg={8}>
            <BoatMainDetail boat={boat} />
            <BoatDetailBody boat={boat} />
          </Col>
          <Col xl={3} lg={4}>
            <BoatDetailSidebar boat={boat} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BoatDetail;

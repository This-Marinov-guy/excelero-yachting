"use client";

import { FC } from "react";
import { ProductType } from "@/types/Product";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import { RouteList } from "@/utils/RouteList";
import BoatDetail from "./BoatDetail";

interface BoatDetailContainerProps {
  boat: ProductType;
}

const BoatDetailContainer: FC<BoatDetailContainerProps> = ({ boat }) => {
  return (
    <>
      <Breadcrumbs 
        title={boat.title} 
        url={RouteList.Home.CarDemo1} 
        subTitle="Boats" 
        mainClass="page-breadcrumbs-section"
        image
      />
      <BoatDetail boat={boat} />
    </>
  );
};

export default BoatDetailContainer;

import React from "react";
import CarHomeFilter from "./filterSection";
import ExceleroHero from "./ExceleroHero";

const CarHomeSection = () => {
  return (
    <div className='car-home-section' id="carHome">
      <ExceleroHero />
      <CarHomeFilter />    
    </div>
  );
};

export default CarHomeSection;

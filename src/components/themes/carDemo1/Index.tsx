import { useEffect } from "react";
import HomeSection from "./carHomeSection";
import { useAppDispatch } from "@/redux/hooks";
import { fetchCategoryApiData, fetchProductApiData } from "@/redux/reducers/ProductSlice";
import Categories from "../common/category";
import CarDemoProduct from "./product";
import Services from "./services";
import Offer from "./offer";
import Work from "./work";
import Experience from "./experience";
import About from "./about";
import Testimonials from "./testimonials";

const CarDemo1Container = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProductApiData());
    dispatch(fetchCategoryApiData());
  }, [dispatch]);

  return (
    <>
      <HomeSection />
      {/* <Categories type="carDemo-1"/>
      <CarDemoProduct/>
      <Services/>
      <Offer/>
      <Work/>
      <Experience/>
      <About/>
      <Testimonials/> */}
    </>
  );
};

export default CarDemo1Container;

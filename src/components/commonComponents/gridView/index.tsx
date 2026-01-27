"use client";

import CarCategory from "@/components/car/others/carTopCategory/carCategory";
import CarTopFilter from "@/components/car/others/carTopFilter/topFilter";
import JobRightSideBar from "@/components/job/others/jobBothSidebar/rightSide";
import { Filters } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCardToShow, setOpenFilterSidebar } from "@/redux/reducers/LayoutSlice";
import { fetchProductApiData } from "@/redux/reducers/ProductSlice";
import { GridViewType } from "@/types/Product";
import { FC, Fragment, useEffect, useMemo } from "react";
import { Button, Col, Offcanvas, OffcanvasBody, OffcanvasHeader, Row } from "reactstrap";
import FilterSidebar from "./filter";
import FilterTags from "./filter/FilterTags";
import GridLayout from "./GridLayout";
import TagsShowBox from "./TagsShowBox";

const GridView: FC<GridViewType> = ({ type, gridSize, gridType, view, scrollType, map, modalType, offcanvasSide, side, topFilter, sectionClass, cardShow, tagClass, mapSide, filterClass, category, filter, detailBoxStyle, tagFilter, fluid, initialProducts }) => {
  const { productItem } = useAppSelector((state) => state.product);
  const { openFilterSidebar } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();
  
  const showProduct = useMemo(() => {
    // Use initialProducts if provided (for SSR), otherwise use Redux state
    if (initialProducts && initialProducts.length > 0) {
      return initialProducts.filter((item) => item.type === type);
    }
    return (productItem || []).filter((item) => item.type === type);
  }, [productItem, type, initialProducts]);  

  useEffect(() => {
    // Only fetch from API if no initial products provided
    if (!initialProducts || initialProducts.length === 0) {
      dispatch(fetchProductApiData());
    }
    dispatch(setCardToShow(cardShow || 6));
  }, [cardShow, dispatch, initialProducts]);

  const containerClass = gridSize === 4 ? "custom-container" : fluid ? "container-fluid" : "container";

  let gridColumnClass = "col-xl-9";
  switch (side) {
    case "nosidebar":
      gridColumnClass = "col-lg-12";
      break;
    case "both-side":
      gridColumnClass = "col-xl-6 col-lg-8";
      break;
  }

  return (
    <Fragment>
      <section className={`${type !== "job" ? "section-t-md-space section-b-md-space" : ""} ${sectionClass || ""}`}>
        {category && <CarCategory />}
        <div className={containerClass}>
          <Row>
            {filter && <CarTopFilter />}
            {side !== "nosidebar" && (
              <Col xl={3} className={`filter-sidebar ${side === "right" ? "order-1" : ""}`}>
                <FilterSidebar value={showProduct} modalType={modalType} filterClass={filterClass} type={type} />
              </Col>
            )}
            <div className={gridColumnClass}>
              {tagFilter && <TagsShowBox />}
              <FilterTags side={side} topFilter={topFilter} type={type} mainClass={tagClass} />
              {map ? (
                  <Row className='gy-4'>
                    <Col xl={6} className={`map-section ${mapSide === "right" ? "order-1" : ""}`}>
                      <div id='map'>
                        <iframe src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20281.52037088709!2d56.051818439171534!3d25.89548611084295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ef67bc7d52f2459%3A0xa922da11fbe1044d!2zQWxqb29kIFJlc29ydCDYpdiz2KrYsdin2K3YqSDYp9mE2KzZiNiv!5e0!3m2!1sen!2sin!4v1731671548714!5m2!1sen!2sin' width={650} height={800} style={{ border: 0 }} allowFullScreen loading='lazy' referrerPolicy='no-referrer-when-downgrade' title='Google Maps Embed of Toronto' />
                      </div>
                    </Col>
                    <GridLayout value={showProduct} type={type} gridSize={gridSize} gridType={gridType} view={view} scrollType={scrollType} map={map} />
                  </Row>
              ) : (
                <GridLayout value={showProduct} type={type} gridSize={gridSize} gridType={gridType} view={view} scrollType={scrollType} map={map} detailBoxStyle={detailBoxStyle} jobAds />
              )}
            </div>
            {side === "both-side" && <JobRightSideBar />}
          </Row>
        </div>
      </section>
      <Offcanvas fade direction={offcanvasSide === "right" ? "end" : "start"} isOpen={openFilterSidebar} toggle={() => dispatch(setOpenFilterSidebar())}>
        <OffcanvasHeader>
          {Filters}
          <Button className="close-btn" onClick={() => dispatch(setOpenFilterSidebar())}>
            <i className="ri-close-line" />
          </Button>
        </OffcanvasHeader>
        <OffcanvasBody>
          <FilterSidebar value={showProduct} modalType={modalType} type={type} />
        </OffcanvasBody>
      </Offcanvas>
    </Fragment>
  );
};

export default GridView;

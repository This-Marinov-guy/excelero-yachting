import { FC, Fragment, useEffect, useRef, useState } from "react";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import {Href} from "@/constants";
import { PropertyBoxSliderType } from "@/types/Product";
import { SliderFor, SliderNav } from "@/data/property";
import Image from "next/image";
import { ProductSwiperSetting } from "@/data/demo/demo1";
 
const BoatBoxSlider: FC<PropertyBoxSliderType> = ({ view, data }) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  useEffect(() => {
    if (swiperRef.current) swiperRef.current.init();
  }, []);

  // Check if image is a full URL (from Supabase) or a relative path
  const getImageSrc = (img: string) => {
    if (!img) return "/assets/images/placeholder.jpg";

    return img;
  };
  
  const isExternalUrl = (img: string): boolean => {
    return !!(img && (img.startsWith("http://") || img.startsWith("https://")));
  };  

  return (
    <Fragment>
      { view === "multiple" ? (
        <Fragment>
          <Swiper className="thumb-main-slider ratio_65" {...SliderFor} thumbs={{ swiper: thumbsSwiper }}>
            {data.image.map((img, index) => (
              <SwiperSlide key={index} className="bg-size">
                <div className="bg-img" style={{ position: "relative", width: "100%", height: "100%" }}>
                  <Image src={getImageSrc(img)} alt="boat-img" fill className="object-cover" unoptimized={isExternalUrl(img)} />
                </div>
              </SwiperSlide>
            ))}
            <div className="swiper-button-next" />
            <div className="swiper-button-prev" />
          </Swiper>
          <Swiper className="thumb-sub-slider" {...SliderNav} onSwiper={setThumbsSwiper} onInit={(swiper: SwiperType) => (swiperRef.current = swiper)}>
            {data.image.map((img, i) => (
              <SwiperSlide key={i}>
                <a href={Href}>
                  <div style={{ position: "relative", width: "100%", height: "100px" }}>
                    <Image src={getImageSrc(img)} alt="boat-img" fill className="object-cover img-fluid" unoptimized={isExternalUrl(img)} />
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </Fragment>
      ) : view === "image" ? (
        <div className="bg-img" style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image src={getImageSrc(data.image[0] || "")} alt="boat-img" fill className="object-cover img-fluid" unoptimized={isExternalUrl(data.image[0] || "")} />
        </div>
      ) : (
        <Swiper {...ProductSwiperSetting} onInit={(swiper: SwiperType) => (swiperRef.current = swiper)}>
          {data.image.map((img, index) => (
            <SwiperSlide key={index} className="bg-size">
              <div className="bg-img" style={{ position: "relative", width: "100%", height: "100%" }}>
                <Image src={getImageSrc(img)} alt="boat-img" fill className="object-cover" unoptimized={isExternalUrl(img)} />
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-button-next" />
          <div className="swiper-button-prev" />
        </Swiper>
      )}
    </Fragment>
  );
};

export default BoatBoxSlider;

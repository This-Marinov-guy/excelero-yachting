"use client";
import Image from "next/image";

const ExceleroLoader = () => {
  return (
    <div className="exelero-loader">
      <div className="loader-logo-wrapper">
        <Image
          src="/assets/images/logo/1-transparent.png"
          alt="Exelero Yachting"
          width={1000}
          height={1000}
          className="loader-logo"
          priority
        />
        <div className="loader-spinner"></div>
      </div>
      <h4 className="loader-text">Exelero Yachting</h4>
    </div>
  );
};

export default ExceleroLoader;

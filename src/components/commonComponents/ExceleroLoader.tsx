"use client";
import Image from "next/image";

const ExceleroLoader = () => {
  return (
    <div className="excelero-loader">
      <div className="loader-logo-wrapper">
        <Image
          src="/assets/images/favicons/favicon.ico"
          alt="Excelero Yachting"
          width={120}
          height={120}
          className="loader-logo"
          priority
        />
        <div className="loader-spinner"></div>
      </div>
      <h4 className="loader-text">Excelero Yachting</h4>
    </div>
  );
};

export default ExceleroLoader;

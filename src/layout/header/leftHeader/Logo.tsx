import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo: React.FC<{ part?: string }> = ({ part }) => {
  return (
    <Link href={RouteList.Home.CarDemo1} className='header-logo'>
      <Image height={800} width={800} src={`/assets/images/logo/1.png`} alt='logo' className='img-fluid' />
      {/* <span className='header-toggle__brand-text'>Exelero Yachting</span> */}
    </Link>
  );
};

export default Logo;

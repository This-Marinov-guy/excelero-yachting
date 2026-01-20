import { Href } from "@/constants";
import { useAppDispatch } from "@/redux/hooks";
import { setCartData } from "@/redux/reducers/LayoutSlice";
import { LeftHeaderProps } from "@/types/Layout";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "./Logo";
import PropertyDropDown from "./PropertyDropdown";

const LeftHeader: React.FC<LeftHeaderProps> = ({ sidebarOpen, part, isJobOrProperty }) => {
  const dispatch = useAppDispatch();
  return (
    <div className='left-side-header'>
      <Link scroll={false} href={Href} className={`toggle ${sidebarOpen ? "open" : ""}`} onClick={() => dispatch(setCartData())}>
        <i className='ri-menu-line header-toggle__icon' />
        <span className='header-toggle__brand' aria-label='Excelero Yachting menu'>
          <span className='header-toggle__brand-logo' aria-hidden='true'>
            <Image src='/assets/images/favicons/favicon.ico' alt='' width={22} height={22} />
          </span>
          <span className='header-toggle__brand-text'>Excelero Yachting</span>
        </span>
      </Link>
      <Logo part={part} />
      {/* <PropertyDropDown part={part} isJobOrProperty={isJobOrProperty} /> */}
    </div>
  );
};

export default LeftHeader;

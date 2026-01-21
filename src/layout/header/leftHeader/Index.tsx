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
        <span className='header-toggle__brand' aria-label='Exelero Yachting menu'>
          <span className='header-toggle__brand-logo' aria-hidden='true'>
            <Image src='/assets/images/logo/1-transparent.png' alt='' width={45} height={45} />
          </span>
          <span className='header-toggle__brand-text'>Exelero Yachting</span>
        </span>
      <Logo part={part} />
      {/* <PropertyDropDown part={part} isJobOrProperty={isJobOrProperty} /> */}
    </div>
  );
};

export default LeftHeader;

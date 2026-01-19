import { Href } from "@/constants";
import { ContainerClassMap, HeaderClassMap } from "@/data/layout/Header";
import { useAppSelector } from "@/redux/hooks";
import { PathTypes } from "@/types/Layout";
import UseStickyBar from "@/utils/UseStickyBar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "reactstrap";
import LeftHeader from "./leftHeader/Index";
import MainMenu from "./mainMenu";
import RightHeader from "./rightHeader/Index";
import TopBar from "./topBar";
import TapTop from "../TapTop";

const Header: React.FC<PathTypes> = ({ part }) => {
  const { sidebarOpen } = useAppSelector((state) => state.layout);
  const isTopBar = ["car-2", "property-2"].some((item) => part?.includes(item));
  const isJobOrProperty = ["job-2", "job-3", "property-2"].some((item) => part?.includes(item));
  const isSticky = UseStickyBar(100);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 992);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <header className={`px-0${HeaderClassMap[part] || ""} ${isSticky && !isMobile ? "sticky-header" : ""}`} id='header'>
      {isTopBar && <TapTop part={part} />}
      <Container className={ContainerClassMap[part] || ""}>
        <div className='header-flex'>
          <LeftHeader sidebarOpen={sidebarOpen} part={part} isJobOrProperty={isJobOrProperty} />
          <MainMenu />
          {/* <RightHeader part={part} isJobOrProperty={isJobOrProperty} /> */}
        </div>
      </Container>
      <Link scroll={false} href={Href} className={`overlay ${sidebarOpen ? " overlay--active" : ""}`} />
    </header>
  );
};

export default Header;

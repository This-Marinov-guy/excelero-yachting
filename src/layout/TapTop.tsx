import { useEffect, useState } from "react";
import { Button } from "reactstrap";
import { PathTypes } from "../types/Layout";
import { ImagePath } from "@/constants";
import Image from "next/image";

const TapTop: React.FC<PathTypes> = ({ part }) => {
  const [tapTopStyle, setTapTopStyle] = useState(false);

  const executeScroll = () => window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  const handleScroll = () => {
    if (window.scrollY > 100) setTapTopStyle(true);
    else setTapTopStyle(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isJobOrProperty = true;

  return (
    <div className={`tap-to-tap ${isJobOrProperty ? (part === 'job' ? "job-color-change" : "") : "car-top"} ${tapTopStyle ? " show" : ""}`}>
      <Button color="transparent" onClick={executeScroll} className={isJobOrProperty ? "top-box" : ""}>
        {isJobOrProperty ? <i className="ri-arrow-up-line" /> : <Image height={100} width={100} src={`${ImagePath}/${part?.includes("car-2") ? "car2" : "car"}/tap-to-top.png`} alt="car-top" className="img-fluid" />}
      </Button>
    </div>
  );
};

export default TapTop;

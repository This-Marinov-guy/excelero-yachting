import SearchTabList from "@/components/themes/common/SearchTabList";
import Image from "next/image";
import { Container } from "reactstrap";
import ParticleComponent from "./ParticleComponent";

const TopFilter = () => {
  return (
    <div className='breadcrumbs-section top-filter-section'>
      <div className="top-filter-background">
        <Image
          src="/assets/images/hero/main2.png"
          alt="Exelero Yachting"
          fill
          className="top-filter-bg-image"
          priority
          style={{ objectFit: "cover" }}
        />
        <div className="top-filter-overlay"></div>
      </div>
      <Container>
        <div className='breadcrumbs-main'>
          <div className='property-home-tab'>
            <SearchTabList endPoint={2} showTab={[1, 2, 10, 11]} showNav />
          </div>
        </div>
      </Container>
      <ParticleComponent />
    </div>
  );
};

export default TopFilter;


import { FC } from "react";
import { ProductType } from "@/types/Product";
import Image from "next/image";
import RatioImage from "@/utils/RatioImage";

interface BoatDetailImagesProps {
  boat: ProductType;
}

const BoatDetailImages: FC<BoatDetailImagesProps> = ({ boat }) => {
  if (!boat.image || boat.image.length === 0) {
    return null;
  }

  return (
    <div className="detail-images">
      <RatioImage 
        src={boat.image[0]} 
        alt={boat.title} 
        className="img-fluid bg-img" 
      />
    </div>
  );
};

export default BoatDetailImages;

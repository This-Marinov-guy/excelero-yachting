import { NotFoundContent, SVGPath } from "@/constants";
import Image from "next/image";
import { FC } from "react";

const NotFound: FC<{ word: string }> = ({ word }) => {
  return (
    <div className="no-found-item text-center">
      {/* <Image width={327} height={308} src={`${SVGPath}/other/not-found.svg`} alt="not-found" className="img-fluid" priority /> */}
      <div className="no-found-content">
        <h3>{word}</h3>
        <p>{NotFoundContent}</p>
      </div>
    </div>
  );
};

export default NotFound;
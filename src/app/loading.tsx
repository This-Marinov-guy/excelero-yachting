"use client";
import Image from "next/image";
import { GifPath } from "@/constants";
import { Loaders } from "@/data/layout/Loader";
import { PathTypes } from "@/types/Layout";
import { usePathname } from "next/navigation";

const Loading: React.FC<PathTypes> = () => {
  const pathname = usePathname();
  const symbolRegex = /[!@#\$%\^\*\(\)_\+\{\}\[\]:;"'<>,.?/\\|`~=]/g;
  const [firstPartRaw] = pathname.split("/").slice(1);
  const firstPart = firstPartRaw.replace(symbolRegex, "").toLowerCase();

  const loaderKey = Object.keys(Loaders).find((key) => key.toLowerCase() === firstPart.toLowerCase());

  const loaderContent = Loaders[loaderKey || ""]?.svg || Loaders["default"]?.svg || (
    <>
      <Image src={`${GifPath}/${Loaders[loaderKey || ""]?.src || "car1-loader.gif"}`} priority height={Loaders[loaderKey || ""]?.height || 47} width={Loaders[loaderKey || ""]?.width || 150} alt='loader' unoptimized className='img-fluid' />
      <h4>{Loaders[loaderKey || ""]?.text || "Loading Car rental Template. Please wait…"}</h4>
    </>
  );

  return (
    <>
      <div className='loader-wrapper'>
        <div className="text-center exelero-loader-wrapper">{loaderContent}</div>
      </div>
    </>
  );
};

export default Loading;

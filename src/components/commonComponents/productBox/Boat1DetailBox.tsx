"use client";
import { Href } from "@/constants";
import { ProductCardType } from "@/types/Product";
import { RouteList } from "@/utils/RouteList";
import SvgIcon from "@/utils/SvgIcon";
import { Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import toast from "react-hot-toast";
import { Button, Label } from "reactstrap";
import BoatBoxSlider from "./BoatBoxSlider";
import { usePathname, useRouter } from "next/navigation";

const Boat1DetailBox: FC<ProductCardType> = ({ data, view, wishlist }) => {
  const location = usePathname() || "";
  const router = useRouter();

  const handleWishlist = () => toast.success("Added to Wishlist successfully");

  const showDescription = location.includes("listing");

  const handleClick = () => {
    router.push(view === "multiple" ? Href : `/boats/${data.id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <article className='featured-box'>
      <div className='featured-main-img'>
        <div className='featured-img' onClick={handleClick}>
          <BoatBoxSlider view={view} data={data} />
        </div>
        {data.label && <Label className='save-btn-label'>{data.label.text}</Label>}
        {wishlist ? (
          <Button className='remove-button'>
            <i className='ri-delete-bin-line'></i>
          </Button>
        ) : (
          <Button className='save-btn' onClick={handleWishlist}>
            <Bookmark className='h-4 w-4' />
          </Button>
        )}
      </div>
      <div className='featured-content'>
        <Link href={`/boats/${data.id}`}>{data.title}</Link>
        {showDescription && <p>{data.description}</p>}
        <p>{data.location}</p>
        <ul className='featured-list'>
          {data?.features?.slice(0, 3)?.map((item, i) => {
            return (
              <li key={i}>
                <SvgIcon iconId={`/property/sprite/${item.icon}`} />
                <span>{item.text}</span>
              </li>
            );
          })}
        </ul>
        <div className='featured-price'>
          <h5>{formatPrice(data.price || 0)} <span style={{fontFamily: 'Satisfy'}}>€</span></h5>
          <Link href={`/boats/${data.id}`} className='btn-solid'>
            More
          </Link>
        </div>
      </div>
    </article>
  );
};

export default Boat1DetailBox;

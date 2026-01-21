import { Href, VideoPath } from "@/constants";
import { useAppDispatch } from "@/redux/hooks";
import { deleteProduct } from "@/redux/reducers/ProductSlice";
import { ProductCardType } from "@/types/Product";
import { RouteList } from "@/utils/RouteList";
import SvgIcon from "@/utils/SvgIcon";
import { Trash } from "iconsax-react";
import Link from "next/link";
import { FC } from "react";
import toast from "react-hot-toast";
import { Button, Label } from "reactstrap";
import PropertyBoxSlider from "./common/PropertyBoxSlider";
import { usePathname, useRouter } from "next/navigation";

const Property1DetailBox: FC<ProductCardType> = ({ data, view, wishlist, propertyId }) => {
  const dispatch = useAppDispatch();
  const location = usePathname() || "";

  const handleWishlist = () => toast.success("Added to Wishlist successfully");

  const handleDelete = (id: number) => {
    dispatch(deleteProduct(id));
    toast.success("Property successfully Removed !");
  };

  const showDescription = location.includes("listing");

  const router = useRouter();
  const handleClick = () => {
    router.push(view === "multiple" ? Href : RouteList.Property.Detail.PropertySidebarLayout);
  };

  return (
    <article className='featured-box'>
      {view === "video" ? (
        <div className='featured-video'>
          <video ref={(video) => {
            if (video) {
              video.pause();
            }
            }}
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => e.currentTarget.pause()}
            muted
            loop
            autoPlay>
            <source src={data.video ? `${VideoPath}/${data.video}` : `${VideoPath}/main.m4v`} type='video/mp4' />
            <source src={data.video ? `${VideoPath}/${data.video}` : `${VideoPath}/main.m4v`} type='video/ogg' />
          </video>
        </div>
      ) : (
        <div className='featured-main-img'>
          <div className='featured-img' onClick={handleClick} >
            <PropertyBoxSlider view={view} data={data} />
          </div>
          {data.label && <Label className='save-btn-label'>{data.label.text}</Label>}
          {wishlist ? (
            <Button className='remove-button' onClick={() => propertyId && handleDelete(propertyId)}>
              <Trash className='iconsax' />
            </Button>
          ) : (
            <Button className='save-btn' onClick={handleWishlist}>
              <i className='ri-bookmark-line'></i>
            </Button>
          )}
        </div>
      )}
      <div className='featured-content'>
        <Link href={RouteList.Property.Detail.PropertySidebarLayout}>{data.title}</Link>
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
          <h5>${data.price}</h5>
          <Link href={RouteList.Property.Detail.PropertySidebarLayout} className='btn-solid'>
            See More
          </Link>
        </div>
      </div>
    </article>
  );
};

export default Property1DetailBox;

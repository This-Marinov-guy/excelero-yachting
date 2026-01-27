"use client";
import { FC, useState } from "react";
import { ProductType } from "@/types/Product";
import Link from "next/link";
import { Href } from "@/constants";
import ShareModal from "@/components/commonComponents/productDetail/mainDetail/ShareModal";
import { useAppDispatch } from "@/redux/hooks";
import { setShareModal } from "@/redux/reducers/LayoutSlice";
import { Share2, Printer, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

interface BoatMainDetailProps {
  boat: ProductType;
}

const BoatMainDetail: FC<BoatMainDetailProps> = ({ boat }) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [saveBoat, setSaveBoat] = useState<boolean>(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleShare = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(setShareModal());
  };

  const handlePrint = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.print();
  };

  const handleSave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const newSaveState = !saveBoat;
    setSaveBoat(newSaveState);
    if (newSaveState) {
      toast.success("Boat saved to favorites");
    } else {
      toast.success("Boat removed from favorites");
    }
  };

  return (
    <div className="property-detail-main">
      <div className="main-detail-flex">
        <div>
          <h3>{boat.title}</h3>
          <h6>{boat.location || "Location TBD"}</h6>
          <div className="label-flex">
            {boat.boatType && (
              <label className="detail-label">
                {boat.boatType === "racer" ? "Racer" : boat.boatType === "cruiser" ? "Cruiser" : boat.boatType}
              </label>
            )}
            {boat.manufacturer && (
              <label className="detail-label">{boat.manufacturer}</label>
            )}
          </div>
        </div>
        <div className="price-box">
          <h4>
            {formatPrice(boat.price || 0)} <span style={{ fontFamily: "Satisfy" }}>€</span>
            {boat.vatIncluded && <span className="text-muted" style={{ fontSize: "14px" }}> (VAT Included)</span>}
          </h4>
          <ul className="detail-social-list">
            <li>
              <Link scroll={false} href={Href} onClick={handleShare}>
                <Share2 className="h-5 w-5" />
                Share
              </Link>
            </li>
            <li>
              <Link scroll={false} href={Href} className="print-button" onClick={handlePrint}>
                <Printer className="h-5 w-5" />
                Print
              </Link>
            </li>
            <li>
              <Link
                scroll={false}
                href={Href}
                className={`${saveBoat ? "clicked" : ""} add-to-fav`}
                onClick={handleSave}
              >
                <Bookmark className={`h-5 w-5 ${saveBoat ? 'fill-current' : ''}`} />
                Save
              </Link>
            </li>
          </ul>
        </div>
        <ShareModal />
      </div>
    </div>
  );
};

export default BoatMainDetail;

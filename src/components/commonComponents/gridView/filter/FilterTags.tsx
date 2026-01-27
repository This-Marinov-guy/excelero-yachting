import { Href } from "@/constants";
import { FilterTabsListData } from "@/data/car";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCardToShow, setOpenFilterSidebar } from "@/redux/reducers/LayoutSlice";
import { setPopular, setSortBy } from "@/redux/reducers/FilterSlice";
import { TopPanelType } from "@/types/Product";
import Link from "next/link";
import { FC, Fragment, useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

const FilterTags: FC<TopPanelType> = ({ topFilter, side, type, mainClass }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { sortBy } = useAppSelector((state) => state.filter);
  const { totalProduct } = useAppSelector((state) => state.layout);

  const handleSortBy = (sortOption: string) => {
    if (sortOption === "Most Popular") {
      dispatch(setPopular(sortOption));
    } else if (sortOption === "24 Product par page") {
      dispatch(setCardToShow(24));
      dispatch(setPopular(null));
    } else {
      dispatch(setPopular(null));
    }
    dispatch(setSortBy(sortOption));
    setDropdownOpen(false);
  };

  const FilterDropdown = (startPoint: number, endPoint: number) => (
    <Dropdown className='select-dropdown' isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
      <DropdownToggle className='select-button' color="">{sortBy || "Sort By"}</DropdownToggle>
      <DropdownMenu className='select-menu' end>
        {FilterTabsListData.slice(startPoint, endPoint).map((item, index) => (
          <DropdownItem onClick={() => handleSortBy(item)} key={index} className="select-item">
            <Link href={Href} scroll={false} className={`select-item ${sortBy === item ? "active" : ""}`}>
              {item}
            </Link>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );

  return (
    <div className={`${mainClass ? mainClass : "top-panel"}`}>
      <Fragment>
        {type === "job" ? (
          <div className='category-filter-flex'>
            <h5>All {totalProduct} jobs got found</h5>
            <div className='category-filter'>
              {!topFilter && (
                <Link href={Href} scroll={false} className={`btn-solid ${side !== "nosidebar" && "filter-btn"}`} onClick={() => dispatch(setOpenFilterSidebar())}>
                  Filter
                </Link>
              )}
              <div className='category-filter'>
                {FilterDropdown(3, 8)}
              </div>
            </div>
          </div>
        ) : (
          <Fragment>
            <h4>
              {totalProduct} {type === "property" ? "properties in Amsterdam" : type === "job" ? "All 980 jobs got found" : type === "boat" ? "boats found" : "Cars To Explore"}
            </h4>
            {type === "property" ? (
              <Fragment>
                {FilterDropdown(0, 3)}
                {!topFilter && (
                  <Link href={Href} scroll={false} className={`btn-solid ${side !== "nosidebar" && "filter-btn"}`} onClick={() => dispatch(setOpenFilterSidebar())}>
                    Filter
                  </Link>
                )}
              </Fragment>
            ) : (
              <div className='category-filter'>
                <div className='car-sortby-flex'>
                  {FilterDropdown(3, 8)}
                </div>
                {!topFilter && (
                  <Link href={Href} scroll={false} className={`btn-solid ${side !== "nosidebar" && "filter-btn"}`} onClick={() => dispatch(setOpenFilterSidebar())}>
                    Filter
                  </Link>
                )}
              </div>
            )}
          </Fragment>
        )}
      </Fragment>
    </div>
  );
};

export default FilterTags;

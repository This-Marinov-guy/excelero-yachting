import { AmenitiesData, BhkOptions, PropertyTypeData } from "@/data/property";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { FilterSidebarType } from "@/types/Product";
import { FC, Fragment, useEffect, useState, useMemo } from "react";
import { UncontrolledAccordion } from "reactstrap";
import CommonAccordion from "./common/CommonAccordion";
import BrandsFilter from "./BrandsFilter";
import { setMinAndMaxKilometers, setMinAndMaxPrice, setMinAndMaxSalary } from "@/redux/reducers/FilterSlice";
import { ColorData, FilterCategory, FuelType, ModelYearData, OwnerData, SeatsData, TransmissionData } from "@/data/car";
import { AllCategoriesData, ByData, CompanyTypeData, EducationData, JobTypeData, LocationData, TopCompaniesData, WorkModeData } from "@/data/job";
import { VatIncludedData } from "@/data/boat";

const FilterSidebar: FC<FilterSidebarType> = ({ value, modalType, filterClass, type }) => {
  const dispatch = useAppDispatch();
  const { propertyType, bedsRooms, squareFeetStatus, yearBuiltStatus, amenities, categories, fuelType, modelYear, seats, color, carTransmissions, ownerDetail, jobAllCategory,JobWorkMode ,JobCompanyType ,JobEducation ,JobCheck,JobLocation,JobTopCompanies,JobType, boatManufacturer, boatDesigner, boatLocation, boatBeamStatus, boatDraftStatus, boatDisplacementStatus, boatEnginePowerStatus, boatVatIncluded} = useAppSelector((state) => state.filter);
  const ItemData = ["1", "2", "3", "map-id"];
  const [openItems, setOpenItems] = useState<string[]>(ItemData);
  const toggle = (id: string) => setOpenItems((openItems) => (openItems.includes(id) ? openItems.filter((item) => item !== id) : [...openItems, id]));

  // Generate dynamic filter data from boat values
  const boatManufacturerData = useMemo(() => {
    if (type !== "boat" || !value) return [];
    const manufacturers = new Set<string>();
    value.forEach(boat => {
      if (Array.isArray(boat.category)) {
        boat.category.forEach(cat => manufacturers.add(cat));
      } else if (boat.category) {
        manufacturers.add(boat.category);
      }
    });
    return Array.from(manufacturers).map(manufacturer => ({
      id: `manufacturer-${manufacturer.toLowerCase().replace(/\s+/g, '-')}`,
      label: manufacturer,
      type: "manufacturer",
    }));
  }, [value, type]);

  const boatLocationData = useMemo(() => {
    if (type !== "boat" || !value) return [];
    const locations = new Set<string>();
    value.forEach(boat => {
      if (boat.location) locations.add(boat.location);
    });
    return Array.from(locations).map(location => ({
      id: `location-${location.toLowerCase().replace(/\s+/g, '-')}`,
      label: location,
      type: "location",
    }));
  }, [value, type]);

  let minPrice = Array.isArray(value) && value.length > 0 ? value.reduce((res: any, obj: any) => (Math.round(obj?.price) < Math.round(res?.price) ? obj : res)) : undefined;
  let maxPrice = Array.isArray(value) && value.length > 0 ? value.reduce((res: any, obj: any) => (Math.round(obj?.price) > Math.round(res?.price) ? obj : res)) : undefined;

  let minKiloMeters = Array.isArray(value) && value.length > 0 ? value.reduce((res: any, obj: any) => (Math.round(obj?.kilometers) < Math.round(res?.kilometers) ? obj : res)) : undefined;
  let maxKiloMeters = Array.isArray(value) && value.length > 0 ? value.reduce((res: any, obj: any) => (Math.round(obj?.kilometers) > Math.round(res?.kilometers) ? obj : res)) : undefined;

  let minSalary = Array.isArray(value) && value.length > 0 ? value.reduce((res: any, obj: any) => (Math.round(obj?.salary) < Math.round(res?.salary) ? obj : res)) : undefined;
  let maxSalary = Array.isArray(value) && value.length > 0 ? value.reduce((res: any, obj: any) => (Math.round(obj?.salary) > Math.round(res?.salary) ? obj : res)) : undefined;

  // Boat-specific min/max values
  let minBeam = Array.isArray(value) && value.length > 0 && type === "boat" ? value.reduce((res: any, obj: any) => {
    const beam = obj?.squareFeet ? obj.squareFeet / 10.764 : 0; // Convert back from squareFeet approximation
    const resBeam = res?.squareFeet ? res.squareFeet / 10.764 : 0;
    return beam < resBeam ? obj : res;
  }) : undefined;
  let maxBeam = Array.isArray(value) && value.length > 0 && type === "boat" ? value.reduce((res: any, obj: any) => {
    const beam = obj?.squareFeet ? obj.squareFeet / 10.764 : 0;
    const resBeam = res?.squareFeet ? res.squareFeet / 10.764 : 0;
    return beam > resBeam ? obj : res;
  }) : undefined;

  useEffect(() => {
    dispatch(setMinAndMaxPrice([minPrice?.price, maxPrice?.price]));
    dispatch(setMinAndMaxKilometers([minKiloMeters?.kilometers, maxKiloMeters?.kilometers]));
    dispatch(setMinAndMaxSalary([minSalary?.salary, maxSalary?.salary]));
  }, [dispatch, maxKiloMeters, maxPrice, maxSalary?.salary, minKiloMeters, minPrice, minSalary?.salary]);

  return (
    <div className={`${filterClass ? filterClass : type==='job'?'job-sidebar': ""} property-sidebar`}>
      <UncontrolledAccordion defaultOpen={openItems} stayOpen toggle={toggle} className={`${type === "car" ? "car" : type === "job" ? "car-accordion job" : ""}-accordion`}>
        <Fragment>
          <CommonAccordion title='Price Range' id='1' priceRange type={type} maxPrice={maxPrice?.price} minPrice={minPrice?.price} />
          <CommonAccordion title='Year Built' id='2' squareFeet values={yearBuiltStatus} />
          <CommonAccordion title='Hull Length (m)' id='3' squareFeet values={squareFeetStatus} />
          {boatManufacturerData.length > 0 && <CommonAccordion title='Manufacturer' id='4' data={boatManufacturerData} checkValue={boatManufacturer} type={type} />}
          {boatLocationData.length > 0 && <CommonAccordion title='Location' id='5' data={boatLocationData} checkValue={boatLocation} type={type} />}
          <CommonAccordion title='Beam (m)' id='6' squareFeet values={boatBeamStatus} />
          <CommonAccordion title='Draft (m)' id='7' squareFeet values={boatDraftStatus} />
          <CommonAccordion title='Displacement (kg)' id='8' squareFeet values={boatDisplacementStatus} />
          <CommonAccordion title='Engine Power (hp)' id='9' squareFeet values={boatEnginePowerStatus} />
          {/* <CommonAccordion title='VAT Status' id='10' data={VatIncludedData} checkValue={boatVatIncluded !== null ? String(boatVatIncluded) : ""} type={type} radio /> */}
        </Fragment>
      </UncontrolledAccordion>
    </div>
  );
};

export default FilterSidebar;

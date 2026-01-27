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
        {type === "property" ? (
          <Fragment>
            {modalType === "modal" && <CommonAccordion title='Map Modal' id='map-id' modalType={modalType} />}
            <CommonAccordion title='Property Type' id='1' data={PropertyTypeData} checkValue={propertyType} />
            <CommonAccordion title='Price range' id='2' priceRange maxPrice={maxPrice?.price} minPrice={minPrice?.price} />
            <CommonAccordion title='beds rooms' id='3' data={BhkOptions} checkValue={bedsRooms} />
            <CommonAccordion title='Square Feet' id='4' squareFeet values={squareFeetStatus} />
            <CommonAccordion title='Year Built' id='5' squareFeet values={yearBuiltStatus} />
            <CommonAccordion title='Amenities' id='6' data={AmenitiesData} checkValue={amenities} />
          </Fragment>
        ) : type === "boat" ? (
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
            <CommonAccordion title='VAT Status' id='10' data={VatIncludedData} checkValue={boatVatIncluded !== null ? String(boatVatIncluded) : ""} type={type} radio />
          </Fragment>
        ) : type === "job" ? (
          <Fragment>
            <CommonAccordion title='All Categories' id='1' data={AllCategoriesData} checkValue={jobAllCategory} type={type}/>
            <CommonAccordion title='Salary' id='2' priceRange type={type} />
            <CommonAccordion title='Work Mode' id='3' data={WorkModeData} checkValue={JobWorkMode} type={type} radio/>
            <CommonAccordion title='Company Type' id='4' data={CompanyTypeData} checkValue={JobCompanyType} type={type}/>
            <CommonAccordion title='Education' id='5' data={EducationData} checkValue={JobEducation} type={type}/>
            <CommonAccordion title='by' id='6' data={ByData} checkValue={JobCheck} type={type}/>
            <CommonAccordion title='Location' id='7' data={LocationData} checkValue={JobLocation} type={type}/>
            <CommonAccordion title="Top Companies" id="8" data={TopCompaniesData} checkValue={JobTopCompanies} type={type}/>
            <CommonAccordion title="Job Type" id="9" data={JobTypeData} checkValue={JobType} type={type}/>
          </Fragment>
        ) : (
          <Fragment>
            <BrandsFilter id='1' />
            <CommonAccordion title='Budget' id='2' priceRange type={type} />
            <CommonAccordion title='Categories' id='3' data={FilterCategory} checkValue={categories} type={type} radio />
            <CommonAccordion title='Fuel Type' id='4' data={FuelType} checkValue={fuelType} type={type} />
            <CommonAccordion title='Modal Year' id='5' data={ModelYearData} checkValue={modelYear} type={type} radio />
            <CommonAccordion title='Seats' id='6' data={SeatsData} checkValue={seats} type={type} />
            <CommonAccordion title='Color' id='7' data={ColorData} checkValue={color} type={type} colors />
            <CommonAccordion title='KMS Driven' id='8' priceRange type='KMS' />
            <CommonAccordion title='Transmission' id='9' data={TransmissionData} checkValue={carTransmissions} type={type} />
            <CommonAccordion title='Owner' id='10' data={OwnerData} checkValue={ownerDetail} type={type} />
          </Fragment>
        )}
      </UncontrolledAccordion>
    </div>
  );
};

export default FilterSidebar;

import { useAppSelector } from "@/redux/hooks";
import { FilterProductsType, ProductType } from "@/types/Product";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

const UseFilterBoats = ({ value }: FilterProductsType) => {
  const { sortBy, popular, priceStatus, yearBuiltStatus, squareFeetStatus, boatType, boatManufacturer, boatDesigner, boatLocation, boatBeamStatus, boatDraftStatus, boatDisplacementStatus, boatEnginePowerStatus, boatVatIncluded } = useAppSelector((state) => state.filter);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const filteredProducts = useMemo(() => {
    return value
      ?.filter((product) => {
        const filteredPrice = product.price !== undefined && priceStatus ? priceStatus[0] <= product.price && priceStatus[1] >= product.price : true;

        const filterYearBuilt = product.year !== undefined && yearBuiltStatus ? yearBuiltStatus[0] <= product.year && yearBuiltStatus[1] >= product.year : true;

        // squareFeetStatus is used for hull length filtering (stored in squareFeet field as meters * 10.764)
        const filterHullLength = product.squareFeet !== undefined && squareFeetStatus ? squareFeetStatus[0] <= product.squareFeet && squareFeetStatus[1] >= product.squareFeet : true;

        const filterBoatType = boatType.length === 0 || (product.boatType && boatType.includes(product.boatType));

        const filterManufacturer = boatManufacturer.length === 0 || (Array.isArray(product.category) ? product.category.some(cat => boatManufacturer.includes(cat)) : boatManufacturer.includes(product.category || ""));

        const filterLocation = boatLocation.length === 0 || (product.location && boatLocation.includes(product.location));

        const filterBeam = product.beam !== undefined && boatBeamStatus ? boatBeamStatus[0] <= product.beam && boatBeamStatus[1] >= product.beam : true;

        const filterDraft = product.draft !== undefined && boatDraftStatus ? boatDraftStatus[0] <= product.draft && boatDraftStatus[1] >= product.draft : true;

        const filterDisplacement = product.displacement !== undefined && boatDisplacementStatus ? boatDisplacementStatus[0] <= product.displacement && boatDisplacementStatus[1] >= product.displacement : true;

        const filterEnginePower = product.enginePower !== undefined && boatEnginePowerStatus ? boatEnginePowerStatus[0] <= product.enginePower && boatEnginePowerStatus[1] >= product.enginePower : true;

        const filterVatIncluded = boatVatIncluded === null || product.vatIncluded === boatVatIncluded;

        const filterMostPopular = !popular || product.productState === popular;

        return filterMostPopular && filteredPrice && filterYearBuilt && filterHullLength && filterBoatType && filterManufacturer && filterLocation && filterBeam && filterDraft && filterDisplacement && filterEnginePower && filterVatIncluded;
      })
      .sort((product1, product2) => {
        if (sortBy === "Price (High to Low)") return (product2.price ?? 0) - (product1.price ?? 0);
        if (sortBy === "Price (Low to High)") return (product1.price ?? 0) - (product2.price ?? 0);
        if (sortBy === "Alphabetical A-Z") return product1.title.localeCompare(product2.title);
        if (sortBy === "Alphabetical Z-A") return product2.title.localeCompare(product1.title);
        if (sortBy === "Year (Newest First)") return (product2.year ?? 0) - (product1.year ?? 0);
        if (sortBy === "Year (Oldest First)") return (product1.year ?? 0) - (product2.year ?? 0);
        return 0;
      });
  }, [value, sortBy, popular, priceStatus, yearBuiltStatus, squareFeetStatus, boatType, boatManufacturer, boatLocation, boatBeamStatus, boatDraftStatus, boatDisplacementStatus, boatEnginePowerStatus, boatVatIncluded]);

  useEffect(() => {
    const baseParams = searchParams ? searchParams.toString() : "";
    const newSearchParams = new URLSearchParams(baseParams);

    ["price", "year", "length", "manufacturer", "location", "beam", "draft", "displacement", "power", "vat"].forEach((name) => newSearchParams.delete(name));

    if (priceStatus) newSearchParams.set("price", `${priceStatus[0]}-${priceStatus[1]}`);
    if (yearBuiltStatus) newSearchParams.set("year", `${yearBuiltStatus[0]}-${yearBuiltStatus[1]}`);
    if (squareFeetStatus) newSearchParams.set("length", `${squareFeetStatus[0]}-${squareFeetStatus[1]}`);
    if (boatManufacturer.length) newSearchParams.set("manufacturer", boatManufacturer.join(","));
    if (boatLocation.length) newSearchParams.set("location", boatLocation.join(","));
    if (boatBeamStatus) newSearchParams.set("beam", `${boatBeamStatus[0]}-${boatBeamStatus[1]}`);
    if (boatDraftStatus) newSearchParams.set("draft", `${boatDraftStatus[0]}-${boatDraftStatus[1]}`);
    if (boatDisplacementStatus) newSearchParams.set("displacement", `${boatDisplacementStatus[0]}-${boatDisplacementStatus[1]}`);
    if (boatEnginePowerStatus) newSearchParams.set("power", `${boatEnginePowerStatus[0]}-${boatEnginePowerStatus[1]}`);
    if (boatVatIncluded !== null) newSearchParams.set("vat", String(boatVatIncluded));

    if (newSearchParams.toString() !== baseParams) {
      router.push(`${pathname}?${newSearchParams}`);
    }
  }, [pathname, priceStatus, router, searchParams, yearBuiltStatus, squareFeetStatus, boatManufacturer, boatLocation, boatBeamStatus, boatDraftStatus, boatDisplacementStatus, boatEnginePowerStatus, boatVatIncluded]);

  return filteredProducts;
};

export default UseFilterBoats;

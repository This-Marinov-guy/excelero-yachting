import { useAppSelector } from "@/redux/hooks";
import { FilterProductsType, ProductType } from "@/types/Product";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const UseFilterCar = ({ value }: FilterProductsType) => {
  const [showProduct, setShowProduct] = useState<ProductType[]>(value || []);
  const { carBrandModel, sortBy, budgetStatus, popular, categories, fuelType, modelYear, seats, color, kmsDriven, carTransmissions, ownerDetail } = useAppSelector((state) => state.filter);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const filteredProducts = useMemo(() => {
    return value
      ?.filter((product) => {
        const BrandModel = carBrandModel.length === 0 || (Array.isArray(product.category) ? product.category.some((cat) => carBrandModel.includes(cat)) : carBrandModel.includes(product.category || ""));

        const BudgetPrice = !budgetStatus || (product.price !== undefined && budgetStatus[0] <= product.price && budgetStatus[1] >= product.price);

        const CategoryFilter = categories.length === 0 || (Array.isArray(product.category) ? product.category.some((cat) => categories.includes(cat)) : categories.includes(product.category || "")) || categories.includes("all");

        const FuelTypes = fuelType.length === 0 || (product.fuel && fuelType.includes(product.fuel));

        const ModelYears = !modelYear || (product.year !== undefined && modelYear <= product.year);

        const AvailableSeats = seats.length === 0 || (product.seats !== undefined && seats.includes(product.seats));

        const AvailableColor = color.length === 0 || (product.color !== undefined && color.includes(product.color));

        const KMSDriven = !kmsDriven || (product.kilometers !== undefined && kmsDriven[0] <= product.kilometers && kmsDriven[1] >= product.kilometers);

        const Transmission = carTransmissions.length === 0 || (product.transmission && carTransmissions.includes(product.transmission));

        const Owner = ownerDetail.length === 0 || (product.owner && ownerDetail.includes(product.owner));

        const MostPopular = !popular || product.productState === popular;

        return BrandModel && BudgetPrice && CategoryFilter && FuelTypes && ModelYears && AvailableSeats && AvailableColor && KMSDriven && Transmission && Owner && MostPopular;
      })
      .sort((a, b) => {
        if (sortBy === "$ High To Low") return (b.price ?? 0) - (a.price ?? 0);
        if (sortBy === "Alphabetical A-Z") return a.title.localeCompare(b.title);
        if (sortBy === "Alphabetical Z-A") return b.title.localeCompare(a.title);
        return 0;
      });
  }, [value, carBrandModel, budgetStatus, categories, fuelType, modelYear, seats, color, kmsDriven, carTransmissions, ownerDetail, popular, sortBy]);

  useEffect(() => {
    setShowProduct(filteredProducts);

    const baseParams = searchParams ? searchParams.toString() : "";
    const newSearchParams = new URLSearchParams(baseParams);
    ["brandmodel", "budget", "categories", "fueltype", "modelYear", "seats", "colors", "kilometers", "transmissions", "owner"].forEach((key) => newSearchParams.delete(key));

    if (carBrandModel.length) newSearchParams.set("brandmodel", carBrandModel.join(","));
    if (budgetStatus) newSearchParams.set("budget", `${budgetStatus[0]}-${budgetStatus[1]}`);
    if (categories.length) newSearchParams.set("categories", categories);
    if (fuelType.length) newSearchParams.set("fueltype", fuelType.join(","));
    if (modelYear) newSearchParams.set("modelYear", modelYear.toString());
    if (seats.length) newSearchParams.set("seats", seats.join("or"));
    if (color.length) newSearchParams.set("colors", color.join(","));
    if (kmsDriven) newSearchParams.set("kilometers", `${kmsDriven[0]}-${kmsDriven[1]}`);
    if (carTransmissions.length) newSearchParams.set("transmissions", carTransmissions.join(","));
    if (ownerDetail.length) newSearchParams.set("owner", ownerDetail.join(","));

    if (newSearchParams.toString() !== baseParams) {
      router.push(`${pathname}?${newSearchParams}`);
    }
  }, [filteredProducts, pathname, router, searchParams, carBrandModel, budgetStatus, categories, fuelType, modelYear, seats, color, kmsDriven, carTransmissions, ownerDetail]);

  return showProduct;
};

export default UseFilterCar;

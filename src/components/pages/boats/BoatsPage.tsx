"use client";
import GridView from "@/components/commonComponents/gridView";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import TopFilter from "@/components/commonComponents/TopFilter";
import { RouteList } from "@/utils/RouteList";

const BoatsPage = () => {
  return (
    <>
      <TopFilter />
      <GridView type={"property"} gridSize={4} cardShow={12} />
    </>
  );
};

export default BoatsPage;

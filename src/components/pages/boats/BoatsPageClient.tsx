import GridView from "@/components/commonComponents/gridView";
import TopFilter from "@/components/commonComponents/TopFilter";
import { ProductType } from "@/types/Product";

type BoatsPageClientProps = {
  boats: ProductType[];
};

const BoatsPageClient = ({ boats }: BoatsPageClientProps) => {
  return (
    <>
      <TopFilter />
      <GridView type={"boat"} gridSize={4} cardShow={12} initialProducts={boats} />
    </>
  );
};

export default BoatsPageClient;

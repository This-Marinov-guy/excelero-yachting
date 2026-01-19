import { LoaderConfig } from "@/types/Layout";
import ExceleroLoader from "@/components/commonComponents/ExceleroLoader";

export const Loaders: Record<string, LoaderConfig> = {
  "car-2": { svg: <ExceleroLoader /> },
  "job": { svg: <ExceleroLoader /> },
  "job-2": { svg: <ExceleroLoader /> },
  "job-3": { svg: <ExceleroLoader /> },
  "property": { svg: <ExceleroLoader /> },
  "property-2": { svg: <ExceleroLoader /> },
  default: { svg: <ExceleroLoader /> },
};

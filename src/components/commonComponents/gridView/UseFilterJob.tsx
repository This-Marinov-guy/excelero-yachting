import { useAppSelector } from "@/redux/hooks";
import { FilterProductsType, ProductType } from "@/types/Product";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

const UseFilterJob = ({ value }: FilterProductsType) => {
  const { jobAllCategory, sortBy, salaryStatus, JobWorkMode, JobCompanyType, JobEducation, JobCheck, JobLocation, JobTopCompanies, JobType } = useAppSelector((state) => state.filter);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const filteredProducts = useMemo(() => {
    return value
      ?.filter((product) => {
        const AllCategory = jobAllCategory.length === 0 || jobAllCategory.some((prop) => product.category?.includes(prop));

        const SalaryDetails = !salaryStatus || (product.salary && salaryStatus[0] <= product.salary && salaryStatus[1] >= product.salary);

        const WorkMode = JobWorkMode.length === 0 || JobWorkMode.includes(product.workType || "");

        const CompanyType = JobCompanyType.length === 0 || JobCompanyType.some((val) => product.companyType?.includes(val));

        const Education = JobEducation.length === 0 || JobEducation.some((val) => product.education?.includes(val));

        const ByCheck = JobCheck.length === 0 || JobCheck.some((val) => product.byJob?.includes(val));

        const Location = JobLocation.length === 0 || JobLocation.some((val) => product.jobLocation?.includes(val));

        const TopCompany = JobTopCompanies.length === 0 || JobTopCompanies.some((val) => product.topCompanies?.includes(val));

        const JobTypes = JobType.length === 0 || JobType.some((val) => product.jobType?.includes(val));

        return AllCategory && SalaryDetails && WorkMode && CompanyType && Education && ByCheck && Location && TopCompany && JobTypes;
      })
      .sort((a, b) => {
        if (sortBy === "$ High To Low") return (b.salary ?? 0) - (a.salary ?? 0);
        if (sortBy === "Alphabetical A-Z") return a.title.localeCompare(b.title);
        if (sortBy === "Alphabetical Z-A") return b.title.localeCompare(a.title);
        return 0;
      });
  }, [value, jobAllCategory, salaryStatus, JobWorkMode, JobCompanyType, JobEducation, JobCheck, JobLocation, JobTopCompanies, JobType, sortBy]);

  useEffect(() => {
    const baseParams = searchParams ? searchParams.toString() : "";
    const newSearchParams = new URLSearchParams(baseParams);

    ["allCategory", "salary", "jobWorkMode", "companyType", "education", "byCheck", "location", "topCompany", "jobType"].forEach((name) => newSearchParams.delete(name));

    if (jobAllCategory.length) newSearchParams.set("allCategory", jobAllCategory.join(","));
    if (salaryStatus) newSearchParams.set("salary", `${salaryStatus[0]}-${salaryStatus[1]}`);
    if (JobWorkMode.length) newSearchParams.set("jobWorkMode", JobWorkMode);
    if (JobCompanyType.length) newSearchParams.set("companyType", JobCompanyType.join(","));
    if (JobEducation.length) newSearchParams.set("education", JobEducation.join(","));
    if (JobCheck.length) newSearchParams.set("byCheck", JobCheck.join(","));
    if (JobLocation.length) newSearchParams.set("location", JobLocation.join(","));
    if (JobTopCompanies.length) newSearchParams.set("topCompany", JobTopCompanies.join(","));
    if (JobType.length) newSearchParams.set("jobType", JobType.join(","));

    if (newSearchParams.toString() !== baseParams) {
      router.push(`${pathname}?${newSearchParams}`);
    }
  }, [pathname, router, searchParams, jobAllCategory, salaryStatus, JobWorkMode, JobCompanyType, JobEducation, JobCheck, JobLocation, JobTopCompanies, JobType]);

  return filteredProducts;
};

export default UseFilterJob;

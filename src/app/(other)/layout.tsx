"use client";
import Customizer from "@/layout/Customizer";
import { PathSettings } from "@/types/Layout";
import { setFavicon } from "@/utils/SetFavicon";
import Aos from "aos";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname() || "";
    const segments = pathname.split("/").slice(1);
    const symbolRegex = /[!@#\$%\^\*\(\)_\+\{\}\[\]:;"'<>,.?/\\|`~=]/g;
    const [firstPart] = segments.map((item) => item.replace(symbolRegex, " "));

    const pathSettings: Record<string, PathSettings> = {
        "car-2": { className: "car2-color", favicon: "favicon-4.png" },
        job: { className: "job-color", favicon: "favicon-5.png" },
        "job-2": { className: "job2-color large-container", favicon: "favicon-6.png" },
        "job-3": { className: "job3-color large-container", favicon: "favicon-7.png" },
        property: { className: "", favicon: "favicon-1.png" },
        "property-2": { className: "property2-color", favicon: "favicon-2.png" },
        default: { className: "car-color", favicon: "favicon-3.png" },
    };

    const { className } = pathSettings[firstPart] || pathSettings.default;

    useEffect(() => {
        document.body.className = className;
        setFavicon("/assets/images/favicons/favicon.ico");
        Aos.init({ once: true });

        return () => setFavicon("/assets/images/favicons/favicon.ico");
    }, [className]);

    return (
        <div>
            {children}
            {/* <Customizer part={segments} /> */}
        </div>
    );
}
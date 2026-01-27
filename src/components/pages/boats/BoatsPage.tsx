import { getSupabaseServerClient } from "@/lib/supabaseServer";
import BoatsPageClient from "./BoatsPageClient";
import { ProductType } from "@/types/Product";

async function fetchActiveBoats(): Promise<ProductType[]> {
  const supabase = getSupabaseServerClient();

  try {
    // Fetch active boats with related data
    const { data: boatsData, error: boatsError } = await supabase
      .from("boats")
      .select("id, created_at")
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (boatsError) {
      console.error("Error fetching boats:", boatsError);
      return [];
    }

    if (!boatsData || boatsData.length === 0) {
      return [];
    }

    // Fetch boat_data, broker_data, and images for each boat
    const boatsWithDetails = await Promise.all(
      boatsData.map(async (boat) => {
        // Fetch boat_data
        const { data: boatData } = await supabase
          .from("boat_data")
          .select("*")
          .eq("boat_id", boat.id)
          .single();

        // Fetch broker_data
        const { data: brokerData } = await supabase
          .from("broker_data")
          .select("name, dealer")
          .eq("boat_id", boat.id)
          .single();

        // Fetch images
        const { data: imagesData } = await supabase
          .from("boat_images")
          .select("link")
          .eq("boat_id", boat.id)
          .order("display_order", { ascending: true });

        // Convert to ProductType format
        const images = imagesData?.map((img) => img.link) || [];
        const mainImage = images[0] || "";

        // Generate a numeric ID from UUID
        const numericId = parseInt(boat.id.replace(/-/g, "").substring(0, 8), 16) % 10000000;

        return {
          id: numericId || Math.floor(Math.random() * 1000000),
          image: images.length > 0 ? images : [mainImage],
          title: boatData?.title || "Untitled Boat",
          type: "boat",
          category: boatData?.manufacturer ? [boatData.manufacturer] : [],
          features: [
            { icon: "length", text: `${boatData?.hull_length || 0}m Length` },
            { icon: "beam", text: `${boatData?.beam || 0}m Beam` },
            { icon: "power", text: `${boatData?.engine_power || 0}hp` },
          ],
          price: boatData?.price || 0,
          description: boatData?.description || "",
          location: boatData?.location || "",
          year: parseInt(boatData?.build_year || "0"),
          squareFeet: Math.round((boatData?.hull_length || 0) * 10.764), // Convert meters to square feet for filtering
          bhk: boatData?.build_year || "",
          amenities: boatData?.manufacturer || "",
          productState: "active",
          wishlist: false,
          seats: "",
          color: "",
          kilometers: 0,
          transmission: "",
          owner: "",
          jobTags: [],
          company: brokerData?.dealer || brokerData?.name || "",
          // Boat-specific properties
          boatId: boat.id,
          manufacturer: boatData?.manufacturer || "",
          designer: boatData?.designer || "",
          buildNumber: boatData?.build_number || "",
          buildYear: boatData?.build_year || "",
          beam: boatData?.beam || 0,
          draft: boatData?.draft || 0,
          waterlineLength: boatData?.waterline_length || 0,
          ballast: boatData?.ballast || 0,
          displacement: boatData?.displacement || 0,
          enginePower: boatData?.engine_power || 0,
          fuelTank: boatData?.fuel_tank || 0,
          waterTank: boatData?.water_tank || 0,
          vatIncluded: boatData?.vat_included ?? true,
          dealer: brokerData?.dealer || "",
          boatType: boatData?.type || "",
        } as ProductType;
      })
    );

    return boatsWithDetails;
  } catch (error) {
    console.error("Error fetching boats:", error);
    return [];
  }
}

const BoatsPage = async () => {
  const boats = await fetchActiveBoats();

  // Add JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Yachts & Boats for Sale",
    description: "Explore our exclusive collection of high-performance yachts and boats for sale",
    url: "/boats",
    numberOfItems: boats.length,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BoatsPageClient boats={boats} />
    </>
  );
};

export default BoatsPage;


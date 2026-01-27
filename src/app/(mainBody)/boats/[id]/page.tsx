import { getSupabaseServerClient } from "@/lib/supabaseServer";
import BoatDetailContainer from "@/components/pages/boats/BoatDetailContainer";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductType } from "@/types/Product";

// Helper function to generate numeric ID from UUID (same as in BoatsPage)
const generateNumericId = (uuid: string): number => {
  return parseInt(uuid.replace(/-/g, "").substring(0, 8), 16) % 10000000;
};

async function fetchBoatById(numericId: number): Promise<ProductType | null> {
  const supabase = getSupabaseServerClient();

  try {
    // Fetch all active boats
    const { data: boatsData, error: boatsError } = await supabase
      .from("boats")
      .select("id, created_at")
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (boatsError) {
      console.error("Error fetching boats:", boatsError);
      return null;
    }

    if (!boatsData || boatsData.length === 0) {
      return null;
    }

    // Find the boat with matching numeric ID
    const boat = boatsData.find((b) => generateNumericId(b.id) === numericId);

    if (!boat) {
      return null;
    }

    // Fetch boat_data
    const { data: boatData } = await supabase
      .from("boat_data")
      .select("*")
      .eq("boat_id", boat.id)
      .single();

    if (!boatData) {
      return null;
    }

    // Fetch broker_data
    const { data: brokerData } = await supabase
      .from("broker_data")
      .select("name, dealer, email, phone, user_id")
      .eq("boat_id", boat.id)
      .single();

    // Fetch broker profile image if user_id exists
    let brokerProfileImage = null;
    if (brokerData?.user_id) {
      const { data: profileImageData } = await supabase
        .from("profile_image")
        .select("image_url")
        .eq("user_id", brokerData.user_id)
        .single();
      
      brokerProfileImage = profileImageData?.image_url || null;
    }

    // Fetch images
    const { data: imagesData } = await supabase
      .from("boat_images")
      .select("link")
      .eq("boat_id", boat.id)
      .order("display_order", { ascending: true });

    // Convert to ProductType format
    const images = imagesData?.map((img) => img.link) || [];
    const mainImage = images[0] || "";

    return {
      id: numericId,
      image: images.length > 0 ? images : [mainImage],
      title: boatData.title || "Untitled Boat",
      type: "boat",
      category: boatData.manufacturer ? [boatData.manufacturer] : [],
      features: [
        { icon: "length", text: `${boatData.hull_length || 0}m Length` },
        { icon: "beam", text: `${boatData.beam || 0}m Beam` },
        { icon: "power", text: `${boatData.engine_power || 0}kW` },
      ],
      price: boatData.price || 0,
      description: boatData.description || "",
      location: boatData.location || "",
      year: parseInt(boatData.build_year || "0"),
      squareFeet: Math.round((boatData.hull_length || 0) * 10.764),
      bhk: boatData.build_year || "",
      amenities: boatData.manufacturer || "",
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
      manufacturer: boatData.manufacturer || "",
      designer: boatData.designer || "",
      buildNumber: boatData.build_number || "",
      buildYear: boatData.build_year || "",
      hullLength: boatData.hull_length || 0,
      beam: boatData.beam || 0,
      draft: boatData.draft || 0,
      waterlineLength: boatData.waterline_length || 0,
      ballast: boatData.ballast || 0,
      displacement: boatData.displacement || 0,
      enginePower: boatData.engine_power || 0,
      fuelTank: boatData.fuel_tank || 0,
      waterTank: boatData.water_tank || 0,
      vatIncluded: boatData.vat_included ?? true,
      dealer: brokerData?.dealer || "",
      boatType: boatData.type || "",
      exteriorDescription: boatData.exterior_description || "",
      additionalDetails: boatData.additional_details || "",
      brochure: boatData.brochure || "",
      brokerName: brokerData?.name || "",
      brokerEmail: brokerData?.email || "",
      brokerPhone: brokerData?.phone || "",
      brokerProfileImage: brokerProfileImage || "",
    } as ProductType;
  } catch (error) {
    console.error("Error fetching boat:", error);
    return null;
  }
}

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const numericId = parseInt(id);
  const boat = await fetchBoatById(numericId);

  if (!boat) {
    return {
      title: "Boat Not Found | Exelero Yachting",
    };
  }

  return {
    title: `${boat.title} | Exelero Yachting`,
    description: boat.description || `Explore ${boat.title} - ${boat.manufacturer} yacht for sale. ${boat.location ? `Located in ${boat.location}.` : ""}`,
    openGraph: {
      title: `${boat.title} | Exelero Yachting`,
      description: boat.description || `Explore ${boat.title} yacht for sale.`,
      url: `/boats/${id}`,
      siteName: "Exelero Yachting",
      type: "website",
      images: boat.image && boat.image.length > 0 ? [
        {
          url: boat.image[0],
          width: 1200,
          height: 630,
          alt: boat.title,
        },
      ] : [],
    },
    alternates: {
      canonical: `/boats/${id}`,
    },
  };
}

const BoatDetail = async ({ params }: Props) => {
  const { id } = await params;
  const numericId = parseInt(id);

  if (isNaN(numericId)) {
    notFound();
  }

  const boat = await fetchBoatById(numericId);

  if (!boat) {
    notFound();
  }

  return <BoatDetailContainer boat={boat} />;
};

export default BoatDetail;

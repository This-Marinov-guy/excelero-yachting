"use client";
import { useState, useEffect, useRef } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { toast } from "sonner";
import Image from "next/image";
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { Eye, EyeSlash, Edit, Trash, More } from "iconsax-react";

type Boat = {
  id: string;
  active: boolean;
  boat_data: {
    title: string;
  } | null;
  broker_data: {
    name: string;
    dealer: string | null;
  } | null;
  main_image: string | null;
};

const BoatsListing = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [loading, setLoading] = useState(true);
  const [boats, setBoats] = useState<Boat[]>([]);
  const [updatingActive, setUpdatingActive] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const checkDealerInfo = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setIsLocked(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("broker_data")
        .select("id")
        .eq("user_id", session.user.id)
        .limit(1);

      setIsLocked(!data || data.length === 0);
      setLoading(false);
    };

    checkDealerInfo();

    // Listen for dealer data changes
    const handleDealerDataChanged = () => {
      checkDealerInfo();
    };
    
    window.addEventListener("dealerDataChanged", handleDealerDataChanged);

    return () => {
      window.removeEventListener("dealerDataChanged", handleDealerDataChanged);
    };
  }, []);

  useEffect(() => {
    if (isLocked || loading) return;

    const fetchBoats = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) return;

      try {
        // Fetch boats with boat_data
        const { data: boatsData, error: boatsError } = await supabase
          .from("boats")
          .select(`
            id,
            active,
            boat_data(title)
          `)
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (boatsError) {
          console.error("Error fetching boats:", boatsError);
          toast.error("Failed to load boats");
          return;
        }

        if (!boatsData) {
          setBoats([]);
          return;
        }

        // Fetch broker_data and main images for each boat
        const boatsWithDetails = await Promise.all(
          boatsData.map(async (boat: any) => {
            // Fetch broker_data
            const { data: brokerData } = await supabase
              .from("broker_data")
              .select("name, dealer")
              .eq("boat_id", boat.id)
              .single();

            // Fetch main image
            const { data: imagesData } = await supabase
              .from("boat_images")
              .select("link")
              .eq("boat_id", boat.id)
              .order("display_order", { ascending: true })
              .limit(1)
              .single();

            return {
              ...boat,
              broker_data: brokerData,
              main_image: imagesData?.link || null,
            };
          })
        );

        setBoats(boatsWithDetails);
      } catch (error) {
        console.error("Error fetching boats:", error);
        toast.error("Failed to load boats");
      }
    };

    fetchBoats();
  }, [isLocked, loading]);

  const handleToggleActive = async (boatId: string, currentActive: boolean) => {
    setUpdatingActive((prev) => new Set(prev).add(boatId));

    const supabase = getSupabaseBrowserClient();

    try {
      const { error } = await supabase
        .from("boats")
        .update({ active: !currentActive })
        .eq("id", boatId);

      if (error) {
        console.error("Error updating boat active status:", error);
        toast.error("Failed to update boat status");
      } else {
        setBoats((prev) =>
          prev.map((boat) =>
            boat.id === boatId ? { ...boat, active: !currentActive } : boat
          )
        );
        toast.success(`Boat ${!currentActive ? "activated" : "hidden"}`);
      }
    } catch (error) {
      console.error("Error toggling boat active status:", error);
      toast.error("Failed to update boat status");
    } finally {
      setUpdatingActive((prev) => {
        const next = new Set(prev);
        next.delete(boatId);
        return next;
      });
    }
  };

  const handleDelete = async (boatId: string) => {
    if (!confirm("Are you sure you want to delete this boat? This action cannot be undone.")) {
      return;
    }

    setDeleting((prev) => new Set(prev).add(boatId));

    const supabase = getSupabaseBrowserClient();

    try {
      // Delete boat (cascade will handle related records)
      const { error } = await supabase.from("boats").delete().eq("id", boatId);

      if (error) {
        console.error("Error deleting boat:", error);
        toast.error("Failed to delete boat");
      } else {
        setBoats((prev) => prev.filter((boat) => boat.id !== boatId));
        toast.success("Boat deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting boat:", error);
      toast.error("Failed to delete boat");
    } finally {
      setDeleting((prev) => {
        const next = new Set(prev);
        next.delete(boatId);
        return next;
      });
    }
  };

  const handlePreview = (boatId: string) => {
    // TODO: Implement preview functionality
    toast.info("Preview functionality coming soon");
    setDropdownOpen((prev) => ({ ...prev, [boatId]: false }));
  };

  const handleEdit = (boatId: string) => {
    // TODO: Implement edit functionality
    toast.info("Edit functionality coming soon");
    setDropdownOpen((prev) => ({ ...prev, [boatId]: false }));
  };

  const toggleDropdown = (boatId: string) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [boatId]: !prev[boatId],
    }));
  };

  if (loading) {
    return (
      <div className="locked-section">
        <div className="locked-content">
          <h4 className="dashboard-title">Boats Listing</h4>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="locked-section">
        <div className="locked-content">
          <h4 className="dashboard-title">Boats Listing</h4>
          <p className="text-muted">This section is locked. Please save your dealer information first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="boats-listing-section">
      <h4 className="dashboard-title mb-4">Boats Listing</h4>

      {boats.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No boats found. Upload your first boat to get started.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>Active</th>
                <th style={{ width: "120px" }}>Image</th>
                <th>Title</th>
                <th>Dealer</th>
                <th style={{ width: "200px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {boats.map((boat) => (
                <tr key={boat.id}>
                  <td>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={boat.active}
                        onChange={() => handleToggleActive(boat.id, boat.active)}
                        disabled={updatingActive.has(boat.id)}
                        id={`active-switch-${boat.id}`}
                      />
                      <label className="form-check-label" htmlFor={`active-switch-${boat.id}`} style={{ display: "none" }}>
                        {boat.active ? "Active" : "Inactive"}
                      </label>
                    </div>
                  </td>
                  <td>
                    {boat.main_image ? (
                      <div
                        style={{
                          width: "100px",
                          height: "60px",
                          position: "relative",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={boat.main_image}
                          alt={boat.boat_data?.title || "Boat image"}
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "100px",
                          height: "60px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#999",
                        }}
                      >
                        No image
                      </div>
                    )}
                  </td>
                  <td>
                    <strong>{boat.boat_data?.title || "Untitled"}</strong>
                  </td>
                  <td>
                    {boat.broker_data ? (
                      <>
                        {boat.broker_data.name}
                        {boat.broker_data.dealer && ` - ${boat.broker_data.dealer}`}
                      </>
                    ) : (
                      <span className="text-muted">No dealer</span>
                    )}
                  </td>
                  <td>
                    <Dropdown
                      isOpen={dropdownOpen[boat.id] || false}
                      toggle={() => toggleDropdown(boat.id)}
                    >
                      <DropdownToggle
                        tag="button"
                        className="btn btn-sm btn-outline-secondary"
                        style={{ border: "none", background: "transparent" }}
                      >
                        <More className="iconsax" style={{ width: "20px", height: "20px" }} />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={() => handlePreview(boat.id)}>
                          <div className="d-flex align-items-center gap-2">
                            <Eye className="iconsax" style={{ width: "16px", height: "16px" }} />
                            <span>Preview</span>
                          </div>
                        </DropdownItem>
                        <DropdownItem onClick={() => handleEdit(boat.id)}>
                          <div className="d-flex align-items-center gap-2">
                            <Edit className="iconsax" style={{ width: "16px", height: "16px" }} />
                            <span>Edit</span>
                          </div>
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem
                          onClick={() => handleDelete(boat.id)}
                          disabled={deleting.has(boat.id)}
                          className={deleting.has(boat.id) ? "" : "text-danger"}
                        >
                          <div className="d-flex align-items-center gap-2">
                            {deleting.has(boat.id) ? (
                              <span className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </span>
                            ) : (
                              <Trash className="iconsax" style={{ width: "16px", height: "16px" }} />
                            )}
                            <span>Delete</span>
                          </div>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BoatsListing;

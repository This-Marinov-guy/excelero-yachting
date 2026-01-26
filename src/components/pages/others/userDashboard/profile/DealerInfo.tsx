"use client";
import { useState, useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Button, Card, CardBody, CardTitle, Modal, ModalBody, ModalHeader } from "reactstrap";
import CommonInput from "@/components/commonComponents/CommonInput";
import { Edit2, Trash, Add } from "iconsax-react";
import CloseBtn from "@/components/commonComponents/CloseBtn";

type BrokerData = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  dealer: string | null;
  boat_id: string;
};

type DealerInfoProps = {
  onDataChange?: () => void;
};

const DealerInfo = ({ onDataChange }: DealerInfoProps) => {
  const [brokerDataList, setBrokerDataList] = useState<BrokerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dealer: "",
  });

  useEffect(() => {
    fetchBrokerData();
  }, []);

  const fetchBrokerData = async () => {
    const supabase = getSupabaseBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("broker_data")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load dealer information");
      setLoading(false);
      return;
    }

    setBrokerDataList(data || []);
    setShowForm(data && data.length === 0);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getSupabaseBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      toast.error("You must be signed in to save dealer information");
      return;
    }

    // Validation
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      if (editingId) {
        // Update existing
        const { error } = await supabase
          .from("broker_data")
          .update({
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            dealer: formData.dealer || null,
          })
          .eq("id", editingId)
          .eq("user_id", session.user.id);

        if (error) throw error;
        toast.success("Dealer information updated successfully");
      } else {
        // Create new - we need a boat_id, but since this is dealer info, we might need to create a placeholder boat
        // For now, let's require boat_id to be provided or create a minimal boat entry
        // Actually, looking at the schema, broker_data requires boat_id, so we need to handle this
        // Let's create a temporary boat entry or make boat_id nullable for dealer-only entries
        // For now, I'll create a minimal boat entry
        
        // First create a boat
        const { data: boatData, error: boatError } = await supabase
          .from("boats")
          .insert({})
          .select()
          .single();

        if (boatError) throw boatError;

        // Then create broker_data
        const { error } = await supabase
          .from("broker_data")
          .insert({
            boat_id: boatData.id,
            user_id: session.user.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            dealer: formData.dealer || null,
          });

        if (error) throw error;
        toast.success("Dealer information saved successfully");
      }

      setFormData({ name: "", email: "", phone: "", dealer: "" });
      setEditingId(null);
      setShowForm(false);
      await fetchBrokerData();
      onDataChange?.();
      
      // Dispatch custom event to notify sidebar to refresh lock status
      window.dispatchEvent(new CustomEvent("dealerDataChanged"));
    } catch (err: any) {
      toast.error(err?.message || "Failed to save dealer information");
    }
  };

  const handleEdit = (item: BrokerData) => {
    setFormData({
      name: item.name,
      email: item.email,
      phone: item.phone || "",
      dealer: item.dealer || "",
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDeleteClick = (item: BrokerData) => {
    setItemToDelete({ id: item.id, name: item.name });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setDeleting(true);
    const supabase = getSupabaseBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      toast.error("You must be signed in to delete dealer information");
      setDeleting(false);
      setDeleteModalOpen(false);
      setItemToDelete(null);
      return;
    }

    try {
      const { error } = await supabase
        .from("broker_data")
        .delete()
        .eq("id", itemToDelete.id)
        .eq("user_id", session.user.id);

      if (error) throw error;
      toast.success("Dealer information deleted successfully");
      await fetchBrokerData();
      onDataChange?.();
      setDeleteModalOpen(false);
      setItemToDelete(null);
      
      // Dispatch custom event to notify sidebar to refresh lock status
      window.dispatchEvent(new CustomEvent("dealerDataChanged"));
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete dealer information");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  if (loading) {
    return <div className="dealer-info-loading">Loading dealer information...</div>;
  }

  return (
    <div className="dealer-info-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="dashboard-title mb-0">Dealer Information</h4>
        {!showForm && brokerDataList.length > 0 && (
          <Button
            className="btn-solid"
            onClick={() => {
              setFormData({ name: "", email: "", phone: "", dealer: "" });
              setEditingId(null);
              setShowForm(true);
            }}
          >
            <i className="ri-add-line" /> Add Dealer
          </Button>
        )}
      </div>

      {showForm ? (
        <Card className="dealer-form-card">
          <CardBody>
            <CardTitle tag="h5">{editingId ? "Edit Dealer Information" : "Add Dealer Information"}</CardTitle>
            <form onSubmit={handleSubmit} className="dealer-form">
              <div className="mb-3">
                <CommonInput
                  inputType="text"
                  placeholder="Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <CommonInput
                  inputType="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <CommonInput
                  inputType="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <CommonInput
                  inputType="text"
                  placeholder="Dealer"
                  value={formData.dealer}
                  onChange={(e) => setFormData({ ...formData, dealer: e.target.value })}
                />
              </div>
              <div className="d-flex gap-2">
                <Button type="submit" className="btn-solid">
                  {editingId ? "Update" : "Save"}
                </Button>
                <Button
                  type="button"
                  className="btn-outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: "", email: "", phone: "", dealer: "" });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      ) : brokerDataList.length > 0 ? (
        <div className="dealer-cards-grid">
          {brokerDataList.map((item) => (
            <Card key={item.id} className="dealer-card mt-3">
              <CardBody>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <CardTitle tag="h5">{item.name}</CardTitle>
                    <p className="mb-1 text-muted">{item.email}</p>
                    {item.phone && <p className="mb-1 text-muted">{item.phone}</p>}
                    {item.dealer && <p className="mb-0 text-muted">{item.dealer}</p>}
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      className="btn-icon"
                      onClick={() => handleEdit(item)}
                      aria-label="Edit"
                    >
                      <i className="ri-edit-line" />
                    </Button>
                    <Button
                      className="btn-icon danger"
                      onClick={() => handleDeleteClick(item)}
                      aria-label="Delete"
                    >
                      <i className="ri-delete-bin-line" />
                    </Button>
                  </div>
                </div>
              </CardBody>
          </Card>
        ))}
        
        </div>
      ) : null}

      {/* Delete Confirmation Modal */}
      <Modal fade centered className='theme-modal' isOpen={deleteModalOpen} toggle={handleDeleteCancel}>
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <ModalHeader toggle={handleDeleteCancel} close={<CloseBtn toggle={handleDeleteCancel} />} />
            <ModalBody>
              <div className='delete-confirmation-content text-center'>
                <div className='mb-4'>
                  <i className='ri-delete-bin-line' style={{ fontSize: '48px', color: 'rgba(var(--error), 1)' }} />
                </div>
                <h4 className='mb-3'>Delete Dealer Information?</h4>
                <p className='mb-4 text-muted'>
                  Are you sure you want to delete <strong>{itemToDelete?.name}</strong>? This action cannot be undone.
                </p>
                <div className='d-flex align-items-center justify-content-center gap-2'>
                  <Button 
                    className='btn-border' 
                    onClick={handleDeleteCancel}
                    disabled={deleting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className='btn-solid danger' 
                    onClick={handleDeleteConfirm}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </ModalBody>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DealerInfo;

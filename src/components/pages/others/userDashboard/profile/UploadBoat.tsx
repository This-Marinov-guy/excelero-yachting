"use client";
import { useState, useEffect, useRef } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Button, Card, CardBody, CardTitle } from "reactstrap";
import CommonInput from "@/components/commonComponents/CommonInput";
import Image from "next/image";
import Dropzone from "react-dropzone";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  updateFormField,
  updateFormData,
  setImageMetadata,
  addImageMetadata,
  removeImageMetadata,
  reorderImages,
  setMainImageIndex,
  setBrochureFileName,
  resetForm,
  ImageMetadata,
} from "@/redux/reducers/BoatUploadSlice";

// Helper function to resize image to max dimensions
const resizeImage = (file: File, maxWidth: number = 1500, maxHeight: number = 1500): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob"));
            }
          },
          file.type,
          0.9
        );
      };
      img.onerror = reject;
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

type BrokerData = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  dealer: string | null;
  boat_id: string;
};

const UploadBoat = () => {
  const dispatch = useAppDispatch();
  const { formData, imageMetadata, mainImageIndex, brochureFileName } = useAppSelector(
    (state) => state.boatUpload
  );

  const [isLocked, setIsLocked] = useState(true);
  const [loading, setLoading] = useState(true);
  const [brokerDataList, setBrokerDataList] = useState<BrokerData[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  // File objects can't be stored in Redux, so keep them in component state
  // But sync metadata with Redux
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  
  // Keep track of image metadata to file mapping
  const imageFileMapRef = useRef<Map<number, File>>(new Map());
  const imagePreviewMapRef = useRef<Map<number, string>>(new Map());

  // Helper function to update form fields
  const handleFieldChange = (field: keyof typeof formData, value: string | boolean) => {
    dispatch(updateFormField({ field, value }));
  };

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
        .select("id, name, email, phone, dealer, boat_id")
        .eq("user_id", session.user.id);

      if (error) {
        console.error("Error fetching broker data:", error);
        setIsLocked(true);
        setLoading(false);
        return;
      }

      setIsLocked(!data || data.length === 0);
      setBrokerDataList(data || []);
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

  // Note: File objects can't be restored from localStorage
  // Users will need to re-upload images if they refresh the page
  // But form data and image metadata (names, order, main image) are preserved

  const handleImageDrop = async (acceptedFiles: File[]) => {
    if (imageMetadata.length + acceptedFiles.length > 15) {
      toast.error("Maximum 15 images allowed");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const invalidFiles = acceptedFiles.filter(file => !allowedTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error("Invalid file type. Please upload JPEG, PNG, or WebP images only.");
      return;
    }

    // Resize and create previews
    const newImages: File[] = [];
    const newPreviews: string[] = [];
    const newMetadata: ImageMetadata[] = [];

    for (const file of acceptedFiles) {
      try {
        const resizedBlob = await resizeImage(file, 1500, 1500);
        const resizedFile = new File([resizedBlob], file.name, { type: file.type });
        newImages.push(resizedFile);
        
        // Create preview
        const previewUrl = URL.createObjectURL(resizedFile);
        newPreviews.push(previewUrl);
        
        // Create metadata
        const order = imageMetadata.length + newMetadata.length;
        const metadata: ImageMetadata = {
          name: file.name,
          size: resizedFile.size,
          type: file.type,
          order,
        };
        newMetadata.push(metadata);
        
        // Store in refs
        imageFileMapRef.current.set(order, resizedFile);
        imagePreviewMapRef.current.set(order, previewUrl);
      } catch (error) {
        console.error("Error resizing image:", error);
        toast.error(`Failed to process ${file.name}`);
      }
    }

    const updatedImages = [...images, ...newImages];
    const updatedPreviews = [...imagePreviews, ...newPreviews];
    
    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
    
    // Update Redux with metadata
    dispatch(setImageMetadata([...imageMetadata, ...newMetadata]));
    
    // If this is the first image, set it as main
    if (imageMetadata.length === 0 && newMetadata.length > 0) {
      dispatch(setMainImageIndex(0));
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    
    // Revoke object URL to free memory
    URL.revokeObjectURL(newPreviews[index]);
    
    // Remove from refs
    const metadata = imageMetadata[index];
    if (metadata) {
      imageFileMapRef.current.delete(metadata.order);
      imagePreviewMapRef.current.delete(metadata.order);
    }
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
    
    // Update Redux
    dispatch(removeImageMetadata(index));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    
    // Reorder arrays
    const draggedImage = newImages[draggedIndex];
    const draggedPreview = newPreviews[draggedIndex];
    
    newImages.splice(draggedIndex, 1);
    newPreviews.splice(draggedIndex, 1);
    
    newImages.splice(dropIndex, 0, draggedImage);
    newPreviews.splice(dropIndex, 0, draggedPreview);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
    
    // Update Redux
    dispatch(reorderImages({ fromIndex: draggedIndex, toIndex: dropIndex }));
    
    setDraggedIndex(null);
  };

  const setAsMainImage = (index: number) => {
    dispatch(setMainImageIndex(index));
  };

  const handleBrochureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload PDF or DOC/DOCX files only.");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File size too large. Please upload a file smaller than 10MB.");
      return;
    }

    setBrochureFile(file);
    dispatch(setBrochureFileName(file.name));
  };

  const removeBrochure = () => {
    setBrochureFile(null);
    dispatch(setBrochureFileName(null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.dealer_id) {
      toast.error("Please select a dealer");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setSubmitting(true);
    const supabase = getSupabaseBrowserClient();

    try {
      // Step 1: Create boat entry
      const { data: boatData, error: boatError } = await supabase
        .from("boats")
        .insert({})
        .select()
        .single();

      if (boatError) throw boatError;
      if (!boatData) throw new Error("Failed to create boat");

      // Step 2: Create boat_data entry
      const boatDataPayload: any = {
        boat_id: boatData.id,
        title: formData.title.trim(),
        manufacturer: formData.manufacturer.trim() || null,
        build_number: formData.build_number.trim() || null,
        build_year: formData.build_year.trim() || null,
        location: formData.location.trim() || null,
        price: formData.price ? parseInt(formData.price) : null,
        vat_included: formData.vat_included,
        dealer: formData.dealer.trim() || null,
        description: formData.description.trim() || null,
        designer: formData.designer.trim() || null,
        hull_length: formData.hull_length ? parseFloat(formData.hull_length) : null,
        waterline_length: formData.waterline_length ? parseFloat(formData.waterline_length) : null,
        beam: formData.beam ? parseFloat(formData.beam) : null,
        draft: formData.draft ? parseFloat(formData.draft) : null,
        ballast: formData.ballast ? parseInt(formData.ballast) : null,
        displacement: formData.displacement ? parseInt(formData.displacement) : null,
        engine_power: formData.engine_power ? parseFloat(formData.engine_power) : null,
        fuel_tank: formData.fuel_tank ? parseInt(formData.fuel_tank) : null,
        water_tank: formData.water_tank ? parseInt(formData.water_tank) : null,
        brochure: null, // Will be updated after brochure upload
        exterior_description: formData.exterior_description.trim() || null,
      };

      const { error: boatDataError } = await supabase
        .from("boat_data")
        .insert(boatDataPayload);

      if (boatDataError) throw boatDataError;

      // Step 3: Create broker_data entry linking the selected dealer to the boat
      const selectedDealer = brokerDataList.find(d => d.id === formData.dealer_id);
      if (!selectedDealer) throw new Error("Selected dealer not found");

      const { error: brokerDataError } = await supabase
        .from("broker_data")
        .insert({
          boat_id: boatData.id,
          user_id: (await supabase.auth.getSession()).data.session?.user?.id,
          name: selectedDealer.name,
          email: selectedDealer.email,
          phone: selectedDealer.phone,
          dealer: selectedDealer.dealer,
        });

      if (brokerDataError) throw brokerDataError;

      // Step 4: Upload images asynchronously (maintain order and mark main image)
      const bucketName = "boat_images";
      const boatFolder = `${boatData.id}`;
      const imageUploadPromises = images.map(async (image, index) => {
        // Use metadata order if available, otherwise use index
        const displayOrder = imageMetadata[index]?.order ?? index;
        try {
          const fileExt = image.name.split(".").pop();
          const fileName = `${Date.now()}-${index}.${fileExt}`;
          const filePath = `${boatFolder}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, image, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

          if (!urlData?.publicUrl) throw new Error("Failed to get image URL");

          // Save to boat_images table
          // display_order reflects the current order (0 = first/main image)
          // Main image is the one at mainImageIndex
          const { error: dbError } = await supabase
            .from("boat_images")
            .insert({
              boat_id: boatData.id,
              link: urlData.publicUrl,
              display_order: displayOrder, // Order from metadata (0 = first/main)
            });

          if (dbError) throw dbError;
        } catch (error: any) {
          console.error(`Error uploading image ${index}:`, error);
          toast.error(`Failed to upload image ${image.name}`);
        }
      });

      // Step 5: Upload brochure asynchronously
      let brochureUrl: string | null = null;
      if (brochureFile) {
        try {
          const fileExt = brochureFile.name.split(".").pop();
          const fileName = `brochure-${Date.now()}.${fileExt}`;
          const filePath = `${boatFolder}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, brochureFile, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

          if (urlData?.publicUrl) {
            brochureUrl = urlData.publicUrl;
            
            // Update boat_data with brochure URL
            await supabase
              .from("boat_data")
              .update({ brochure: brochureUrl })
              .eq("boat_id", boatData.id);
          }
        } catch (error: any) {
          console.error("Error uploading brochure:", error);
          toast.error("Failed to upload brochure");
        }
      }

      // Wait for all image uploads to complete
      await Promise.all(imageUploadPromises);

      toast.success("Boat uploaded successfully!");
      
      // Reset form (Redux will handle localStorage cleanup)
      dispatch(resetForm());
      setImages([]);
      imagePreviews.forEach((url: string) => URL.revokeObjectURL(url));
      setImagePreviews([]);
      imageFileMapRef.current.clear();
      imagePreviewMapRef.current.clear();
      setDraggedIndex(null);
      setBrochureFile(null);
    } catch (error: any) {
      console.error("Error uploading boat:", error);
      toast.error(error?.message || "Failed to upload boat. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="locked-section">
        <div className="locked-content">
          <h4 className="dashboard-title">Upload Boat</h4>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="locked-section">
        <div className="locked-content">
          <h4 className="dashboard-title">Upload Boat</h4>
          <p className="text-muted">This section is locked. Please save your dealer information first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-boat-section">
      <h4 className="dashboard-title mb-4">Upload Boat</h4>
      
      <Card className="dealer-form-card">
        <CardBody>
          <CardTitle tag="h5">Boat Information</CardTitle>
          <form onSubmit={handleSubmit} className="dealer-form">
            {/* Dealer Selection */}
            <div className="mb-3">
              <label className="form-label">Dealer *</label>
              <select
                className="form-control"
                value={formData.dealer_id}
                onChange={(e) => handleFieldChange("dealer_id", e.target.value)}
                required
              >
                <option value="">Select a dealer</option>
                {brokerDataList.map((dealer) => (
                  <option key={dealer.id} value={dealer.id}>
                    {dealer.name} {dealer.dealer ? `- ${dealer.dealer}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Basic Information */}
            <div className="mb-3">
              <CommonInput
                inputType="text"
                placeholder="Title *"
                value={formData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <CommonInput
                  inputType="text"
                  placeholder="Manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => handleFieldChange("manufacturer", e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <CommonInput
                  inputType="text"
                  placeholder="Build Number"
                  value={formData.build_number}
                  onChange={(e) => handleFieldChange("build_number", e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <CommonInput
                  inputType="text"
                  placeholder="Build Year"
                  value={formData.build_year}
                  onChange={(e) => handleFieldChange("build_year", e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <CommonInput
                  inputType="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => handleFieldChange("location", e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <CommonInput
                  inputType="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => handleFieldChange("price", e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <div className="form-check mt-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={formData.vat_included}
                    onChange={(e) => handleFieldChange("vat_included", e.target.checked)}
                    id="vat_included"
                  />
                  <label className="form-check-label" htmlFor="vat_included">
                    VAT Included
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <CommonInput
                inputType="text"
                placeholder="Dealer"
                value={formData.dealer}
                onChange={(e) => handleFieldChange("dealer", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Description"
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <CommonInput
                inputType="text"
                placeholder="Designer"
                value={formData.designer}
                onChange={(e) => handleFieldChange("designer", e.target.value)}
              />
            </div>

            {/* Dimensions */}
            <h5 className="mt-4 mb-3">Dimensions</h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Hull Length (m)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="Hull Length (m)"
                  value={formData.hull_length}
                  onChange={(e) => handleFieldChange("hull_length", e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Waterline Length (m)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="Waterline Length (m)"
                  value={formData.waterline_length}
                  onChange={(e) => handleFieldChange("waterline_length", e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Beam (m)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="Beam (m)"
                  value={formData.beam}
                  onChange={(e) => handleFieldChange("beam", e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Draft (m)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="Draft (m)"
                  value={formData.draft}
                  onChange={(e) => handleFieldChange("draft", e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <CommonInput
                  inputType="number"
                  placeholder="Ballast (kg)"
                  value={formData.ballast}
                  onChange={(e) => handleFieldChange("ballast", e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <CommonInput
                  inputType="number"
                  placeholder="Displacement (kg)"
                  value={formData.displacement}
                  onChange={(e) => handleFieldChange("displacement", e.target.value)}
                />
              </div>
            </div>

            {/* Engine & Tanks */}
            <h5 className="mt-4 mb-3">Engine & Tanks</h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Engine Power (hp)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="Engine Power (hp)"
                  value={formData.engine_power}
                  onChange={(e) => handleFieldChange("engine_power", e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <CommonInput
                  inputType="number"
                  placeholder="Fuel Tank (L)"
                  value={formData.fuel_tank}
                  onChange={(e) => handleFieldChange("fuel_tank", e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3">
              <CommonInput
                inputType="number"
                placeholder="Water Tank (L)"
                value={formData.water_tank}
                onChange={(e) => handleFieldChange("water_tank", e.target.value)}
              />
            </div>

            {/* Additional Information */}
            <h5 className="mt-4 mb-3">Additional Information</h5>
            
            {/* Image Upload Dropzone */}
            <div className="mb-4">
              <label className="form-label">Boat Images (up to 15 images)</label>
              
              <Dropzone
                onDrop={handleImageDrop}
                accept={{
                  "image/jpeg": [".jpg", ".jpeg"],
                  "image/png": [".png"],
                  "image/webp": [".webp"],
                }}
                maxFiles={15 - imageMetadata.length}
                disabled={imageMetadata.length >= 15}
              >
                {({ getRootProps, getInputProps, isDragActive }) => (
                  <div
                    {...getRootProps()}
                    className={`dropzone-container mb-3 ${isDragActive ? "drag-active" : ""} ${imageMetadata.length >= 15 ? "disabled" : ""}`}
                    style={{
                      border: "2px dashed",
                      borderColor: isDragActive ? "rgba(var(--theme-color), 1)" : "rgba(var(--border-color), 1)",
                      borderRadius: "8px",
                      padding: "40px",
                      textAlign: "center",
                      cursor: imageMetadata.length >= 15 ? "not-allowed" : "pointer",
                      backgroundColor: isDragActive ? "rgba(var(--theme-color), 0.05)" : "transparent",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <input {...getInputProps()} />
                    <i className="ri-image-add-line" style={{ fontSize: "48px", color: "rgba(var(--theme-color), 1)", marginBottom: "16px" }} />
                    <h5 style={{ marginBottom: "8px", color: "rgba(var(--title-color), 1)" }}>
                      {isDragActive ? "Drop images here" : images.length >= 15 ? "Maximum 15 images reached" : "Drag & drop images here, or click to select"}
                    </h5>
                    <p className="text-muted mb-0">
                      {images.length >= 15 ? "" : "Supports JPEG, PNG, WebP (up to 15 images)"}
                    </p>
                  </div>
                )}
              </Dropzone>

              {imageMetadata.length > 0 && (
                <>
                  <div className="row g-3 mb-3">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="col-md-3 col-sm-4 col-6"
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        style={{
                          cursor: "move",
                          opacity: draggedIndex === index ? 0.5 : 1,
                        }}
                      >
                        <div
                          className="position-relative"
                          style={{
                            aspectRatio: "1",
                            overflow: "hidden",
                            borderRadius: "8px",
                            border: mainImageIndex === index ? "3px solid rgba(var(--theme-color), 1)" : "2px solid transparent",
                            boxShadow: mainImageIndex === index ? "0 0 0 2px rgba(var(--theme-color), 0.2)" : "none",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                          
                          {/* Main Image Badge */}
                          {mainImageIndex === index && (
                            <div
                              className="position-absolute top-0 start-0 m-2"
                              style={{
                                backgroundColor: "rgba(var(--theme-color), 1)",
                                color: "#fff",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                fontWeight: "600",
                                zIndex: 10,
                              }}
                            >
                              <i className="ri-star-fill" /> Main
                            </div>
                          )}
                          
                          {/* Remove Button */}
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                            onClick={() => removeImage(index)}
                            style={{ zIndex: 10 }}
                          >
                            <i className="ri-close-line" />
                          </button>
                          
                          {/* Set as Main Button */}
                          {mainImageIndex !== index && (
                            <button
                              type="button"
                              className="btn btn-sm btn-primary position-absolute bottom-0 start-0 m-1"
                              onClick={() => setAsMainImage(index)}
                              style={{ zIndex: 10 }}
                            >
                              <i className="ri-star-line" /> Set Main
                            </button>
                          )}
                          
                          {/* Drag Handle */}
                          <div
                            className="position-absolute bottom-0 end-0 m-1"
                            style={{
                              backgroundColor: "rgba(0, 0, 0, 0.6)",
                              color: "#fff",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              zIndex: 10,
                            }}
                          >
                            <i className="ri-drag-move-2-line" /> {index + 1}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="text-muted mb-0">
                      {imageMetadata.length} / 15 images selected
                    </p>
                    <p className="text-muted mb-0 small">
                      <i className="ri-information-line" /> Drag images to reorder • Click "Set Main" to set main image
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Brochure Upload */}
            <div className="mb-3">
              <label className="form-label">Brochure (PDF or DOC/DOCX)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleBrochureChange}
                className="form-control"
              />
              {brochureFileName && (
                <div className="mt-2 d-flex align-items-center gap-2">
                  <span className="text-muted">
                    <i className="ri-file-line" /> {brochureFileName}
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={removeBrochure}
                  >
                    <i className="ri-delete-bin-line" /> Remove
                  </button>
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Exterior Description</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Exterior Description"
                value={formData.exterior_description}
                onChange={(e) => handleFieldChange("exterior_description", e.target.value)}
              />
            </div>

            <div className="d-flex gap-2 mt-4">
              <Button type="submit" className="btn-solid" disabled={submitting}>
                {submitting ? "Uploading..." : "Upload Boat"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default UploadBoat;

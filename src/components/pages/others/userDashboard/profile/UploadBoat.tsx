"use client";
import { useState, useEffect, useRef } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Button, Card, CardBody, CardTitle } from "reactstrap";
import CommonInput from "@/components/commonComponents/CommonInput";
import dynamic from "next/dynamic";

// Dynamically import RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(
  () => import("@/components/commonComponents/RichTextEditor"),
  { ssr: false }
);
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
    setBrochureUrl,
    setUploadFolderName,
    addUploadedImage,
    removeUploadedImage,
    reorderUploadedImages,
    setUploadedImages,
    resetForm,
    ImageMetadata,
    UploadedImage,
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
    const {
        formData,
        uploadedImages,
        uploadFolderName,
        mainImageIndex,
        brochureFileName,
        brochureUrl
    } = useAppSelector((state) => state.boatUpload);

    const [isLocked, setIsLocked] = useState(true);
    const [loading, setLoading] = useState(true);
    const [brokerDataList, setBrokerDataList] = useState<BrokerData[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImages, setUploadingImages] = useState<Set<number>>(new Set());
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [brochureFile, setBrochureFile] = useState<File | null>(null);

    // Generate unique folder name: timestamp-userId-random
    const generateFolderName = async (): Promise<string> => {
        const supabase = getSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id || "anonymous";
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 9);
        return `temp-${timestamp}-${userId.substring(0, 8)}-${random}`;
    };

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

      // Fetch broker_data entries that don't have a boat yet (boat_id is null)
      // These are available dealers that can be linked to a new boat
      // First, check if user has any broker_data (for lock status)
      const { data: allBrokers, error: allBrokersError } = await supabase
        .from("broker_data")
        .select("id")
        .eq("user_id", session.user.id);

      if (allBrokersError) {
        console.error("Error fetching broker data:", allBrokersError);
        setIsLocked(true);
        setLoading(false);
        return;
      }

      // Check lock status based on whether user has any broker_data
      setIsLocked(!allBrokers || allBrokers.length === 0);

      // Fetch only broker_data entries without boats (available for linking to new boats)
      const { data, error } = await supabase
        .from("broker_data")
        .select("id, name, email, phone, dealer, boat_id")
        .eq("user_id", session.user.id)
        .is("boat_id", null) // Only show dealers without boats
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching available broker data:", error);
      }

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

    // Load uploaded images from folder on mount if folder exists
    useEffect(() => {
        const loadUploadedImages = async () => {
            if (!uploadFolderName) return;

            const supabase = getSupabaseBrowserClient();
            const bucketName = "boat_images";

            try {
                // List all files in the folder
                const { data: files, error } = await supabase.storage
                    .from(bucketName)
                    .list(uploadFolderName, {
                        limit: 100,
                        sortBy: { column: "name", order: "asc" },
                    });

                if (error) {
                    console.error("Error loading images from folder:", error);
                    return;
                }

                if (!files || files.length === 0) return;

                // Filter image files and create uploaded images array
                const imageFiles = files.filter(
                    (file) => file.name.match(/\.(jpg|jpeg|png|webp)$/i) && !file.name.startsWith("brochure-")
                );

                const loadedImages: UploadedImage[] = imageFiles.map((file, index) => {
                    const filePath = `${uploadFolderName}/${file.name}`;
                    const { data: urlData } = supabase.storage
                        .from(bucketName)
                        .getPublicUrl(filePath);

                    return {
                        url: urlData.publicUrl,
                        order: index,
                        name: file.name,
                        filePath,
                    };
                });

                if (loadedImages.length > 0) {
                    dispatch(setUploadedImages(loadedImages));
                    if (mainImageIndex === 0 && loadedImages.length > 0) {
                        dispatch(setMainImageIndex(0));
                    }
                }
            } catch (error) {
                console.error("Error loading uploaded images:", error);
            }
        };

        loadUploadedImages();
    }, [uploadFolderName, dispatch, mainImageIndex]);

    const handleImageDrop = async (acceptedFiles: File[]) => {
        if (uploadedImages.length + acceptedFiles.length > 15) {
            toast.error("Maximum 15 images allowed");
            return;
        }

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        const invalidFiles = acceptedFiles.filter(file => !allowedTypes.includes(file.type));

        if (invalidFiles.length > 0) {
            toast.error("Invalid file type. Please upload JPEG, PNG, or WebP images only.");
            return;
        }

        const supabase = getSupabaseBrowserClient();
        const bucketName = "boat_images";

        // Generate folder name if this is the first image
        let folderName = uploadFolderName;
        if (!folderName) {
            folderName = await generateFolderName();
            dispatch(setUploadFolderName(folderName));
        }

        // Process and upload each image immediately
        const uploadPromises = acceptedFiles.map(async (file, fileIndex) => {
            const order = uploadedImages.length + fileIndex;
            setUploadingImages((prev) => new Set(prev).add(order));

            try {
                // Resize image
                const resizedBlob = await resizeImage(file, 1500, 1500);
                const resizedFile = new File([resizedBlob], file.name, { type: file.type });

                // Upload to storage immediately
                const fileExt = file.name.split(".").pop();
                const fileName = `${Date.now()}-${order}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
                const filePath = `${folderName}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from(bucketName)
                    .upload(filePath, resizedFile, {
                        cacheControl: "3600",
                        upsert: false,
                    });

                if (uploadError) throw uploadError;

                // Get public URL
                const { data: urlData } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(filePath);

                if (!urlData?.publicUrl) throw new Error("Failed to get image URL");

                // Add to Redux
                const uploadedImage: UploadedImage = {
                    url: urlData.publicUrl,
                    order,
                    name: file.name,
                    filePath,
                };

                dispatch(addUploadedImage(uploadedImage));

                // If this is the first image, set it as main
                if (uploadedImages.length === 0 && fileIndex === 0) {
                    dispatch(setMainImageIndex(0));
                }

                toast.success(`Uploaded: ${file.name}`);
            } catch (error: any) {
                console.error(`Error uploading image ${file.name}:`, error);
                toast.error(`Failed to upload ${file.name}: ${error?.message || "Unknown error"}`);
            } finally {
                setUploadingImages((prev) => {
                    const next = new Set(prev);
                    next.delete(order);
                    return next;
                });
            }
        });

        await Promise.all(uploadPromises);
    };

    const removeImage = async (index: number) => {
        const imageToRemove = uploadedImages[index];
        if (!imageToRemove) return;

        const supabase = getSupabaseBrowserClient();
        const bucketName = "boat_images";

        try {
            // Delete from storage
            const { error: deleteError } = await supabase.storage
                .from(bucketName)
                .remove([imageToRemove.filePath]);

            if (deleteError) {
                console.error("Error deleting image from storage:", deleteError);
                toast.error("Failed to delete image from storage");
                return;
            }

            // Update Redux
            dispatch(removeUploadedImage(index));
            toast.success("Image removed");
        } catch (error: any) {
            console.error("Error removing image:", error);
            toast.error("Failed to remove image");
        }
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", index.toString());
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        e.stopPropagation();

        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            return;
        }

        // Update Redux (this will reorder both uploadedImages and metadata)
        dispatch(reorderUploadedImages({ fromIndex: draggedIndex, toIndex: dropIndex }));

        setDraggedIndex(null);
    };

    const setAsMainImage = (index: number) => {
        if (uploadedImages[index] && !uploadingImages.has(index)) {
            dispatch(setMainImageIndex(index));
        }
    };

    const handleBrochureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

        const supabase = getSupabaseBrowserClient();
        const bucketName = "boat_images";

        // Generate folder name if needed
        let folderName = uploadFolderName;
        if (!folderName) {
            folderName = await generateFolderName();
            dispatch(setUploadFolderName(folderName));
        }

        try {
            // Upload brochure immediately
            const fileExt = file.name.split(".").pop();
            const fileName = `brochure-${Date.now()}.${fileExt}`;
            const filePath = `${folderName}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            if (urlData?.publicUrl) {
                dispatch(setBrochureFileName(file.name));
                dispatch(setBrochureUrl(urlData.publicUrl));
                toast.success("Brochure uploaded successfully");
            }
        } catch (error: any) {
            console.error("Error uploading brochure:", error);
            toast.error(`Failed to upload brochure: ${error?.message || "Unknown error"}`);
        }
    };

    const removeBrochure = async () => {
        if (brochureUrl && uploadFolderName) {
            const supabase = getSupabaseBrowserClient();
            const bucketName = "boat_images";

            // Extract file path from URL
            const urlParts = brochureUrl.split(`/${bucketName}/`);
            if (urlParts[1]) {
                const filePath = urlParts[1].split("?")[0];
                try {
                    await supabase.storage.from(bucketName).remove([filePath]);
                } catch (error) {
                    console.error("Error deleting brochure:", error);
                }
            }
        }

        setBrochureFile(null);
        dispatch(setBrochureFileName(null));
        dispatch(setBrochureUrl(null));
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
                brochure: brochureUrl || null, // Use already uploaded brochure URL
                exterior_description: formData.exterior_description.trim() || null,
                additional_details: formData.additional_details.trim() || null,
            };

            const { error: boatDataError } = await supabase
                .from("boat_data")
                .insert(boatDataPayload);

            if (boatDataError) throw boatDataError;

            // Step 3: Update existing broker_data entry to link it to the boat
            const selectedDealer = brokerDataList.find(d => d.id === formData.dealer_id);
            if (!selectedDealer) throw new Error("Selected dealer not found");

            // Update the existing broker_data entry with the boat_id
            const { error: brokerDataError } = await supabase
                .from("broker_data")
                .update({
                    boat_id: boatData.id,
                })
                .eq("id", selectedDealer.id);

            if (brokerDataError) throw brokerDataError;

            // Step 4: Move temp folder to permanent boat_id folder (optional enhancement)
            // For now, we'll keep the temp folder and just create records
            // Optionally, we could move files: await moveFolderToBoatFolder(uploadFolderName, boatData.id);

            // Step 5: Create boat_images records (images are already uploaded)
            if (uploadedImages.length > 0) {
                const imageRecords = uploadedImages.map((img) => ({
                    boat_id: boatData.id,
                    link: img.url,
                    display_order: img.order,
                }));

                const { error: imagesError } = await supabase
                    .from("boat_images")
                    .insert(imageRecords);

                if (imagesError) throw imagesError;
            }

            // Step 6: Update boat_data with brochure URL if uploaded
            if (brochureUrl) {
                await supabase
                    .from("boat_data")
                    .update({ brochure: brochureUrl })
                    .eq("boat_id", boatData.id);
            }

            toast.success("Boat uploaded successfully!");

            // Reset form (Redux will handle localStorage cleanup)
            dispatch(resetForm());
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
                            <label className="form-label">Title *</label>
                            <CommonInput
                                inputType="text"
                                value={formData.title}
                                onChange={(e) => handleFieldChange("title", e.target.value)}
                                required
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Manufacturer</label>
                                <CommonInput
                                    inputType="text"
                                    value={formData.manufacturer}
                                    onChange={(e) => handleFieldChange("manufacturer", e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Build Number</label>
                                <CommonInput
                                    inputType="text"
                                    value={formData.build_number}
                                    onChange={(e) => handleFieldChange("build_number", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Build Year</label>
                                <CommonInput
                                    inputType="text"
                                    value={formData.build_year}
                                    onChange={(e) => handleFieldChange("build_year", e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Location</label>
                                <CommonInput
                                    inputType="text"
                                    value={formData.location}
                                    onChange={(e) => handleFieldChange("location", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Price</label>
                                <CommonInput
                                    inputType="number"
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
                            <label className="form-label">Dealer</label>
                            <CommonInput
                                inputType="text"
                                value={formData.dealer}
                                onChange={(e) => handleFieldChange("dealer", e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <RichTextEditor
                                value={formData.description}
                                onChange={(value) => handleFieldChange("description", value)}
                                rows={4}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Designer</label>
                            <CommonInput
                                inputType="text"
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
                                    value={formData.draft}
                                    onChange={(e) => handleFieldChange("draft", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Ballast (kg)</label>
                                <CommonInput
                                    inputType="number"
                                    value={formData.ballast}
                                    onChange={(e) => handleFieldChange("ballast", e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Displacement (kg)</label>
                                <CommonInput
                                    inputType="number"
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
                                    value={formData.engine_power}
                                    onChange={(e) => handleFieldChange("engine_power", e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Fuel Tank (L)</label>
                                <CommonInput
                                    inputType="number"
                                    value={formData.fuel_tank}
                                    onChange={(e) => handleFieldChange("fuel_tank", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Water Tank (L)</label>
                                <CommonInput
                                    inputType="number"
                                    value={formData.water_tank}
                                    onChange={(e) => handleFieldChange("water_tank", e.target.value)}
                                />
                            </div>
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
                                maxFiles={15 - uploadedImages.length}
                                disabled={uploadedImages.length >= 15}
                            >
                                {({ getRootProps, getInputProps, isDragActive }) => (
                                    <div
                                        {...getRootProps()}
                                        className={`dropzone-container mb-3 ${isDragActive ? "drag-active" : ""} ${uploadedImages.length >= 15 ? "disabled" : ""}`}
                                        style={{
                                            border: "2px dashed",
                                            borderColor: isDragActive ? "rgba(var(--theme-color), 1)" : "rgba(var(--border-color), 1)",
                                            borderRadius: "8px",
                                            padding: "40px",
                                            textAlign: "center",
                                            cursor: uploadedImages.length >= 15 ? "not-allowed" : "pointer",
                                            backgroundColor: isDragActive ? "rgba(var(--theme-color), 0.05)" : "transparent",
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        <input {...getInputProps()} />
                                        <i className="ri-image-add-line" style={{ fontSize: "48px", color: "rgba(var(--theme-color), 1)", marginBottom: "16px" }} />
                                        <h5 style={{ marginBottom: "8px", color: "rgba(var(--title-color), 1)" }}>
                                            {isDragActive ? "Drop images here" : uploadedImages.length >= 15 ? "Maximum 15 images reached" : "Drag & drop images here, or click to select"}
                                        </h5>
                                        <p className="text-muted mb-0">
                                            {uploadedImages.length >= 15 ? "" : "Supports JPEG, PNG, WebP (up to 15 images)"}
                                        </p>
                                    </div>
                                )}
                            </Dropzone>

                            {uploadedImages.length > 0 && (
                                <>
                                    <div className="row g-3 mb-3">
                                        {uploadedImages.map((uploadedImage, index) => (
                      <div
                        key={uploadedImage.filePath}
                        className="col-md-3 col-sm-4 col-6"
                        draggable={!uploadingImages.has(index)}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        onDrop={(e) => handleDrop(e, index)}
                        style={{
                          cursor: uploadingImages.has(index) ? "default" : "move",
                          opacity: draggedIndex === index ? 0.5 : 1,
                        }}
                      >
                        <div
                          className="position-relative"
                          style={{
                            aspectRatio: "1",
                            width: "100%",
                            maxWidth: "200px",
                            maxHeight: "200px",
                            overflow: "hidden",
                            borderRadius: "8px",
                            border: mainImageIndex === index ? "3px solid rgba(var(--theme-color), 1)" : "2px solid transparent",
                            boxShadow: mainImageIndex === index ? "0 0 0 2px rgba(var(--theme-color), 0.2)" : "none",
                            transition: "all 0.3s ease",
                            margin: "0 auto",
                          }}
                        >
                                                    <Image
                                                        src={uploadedImage.url}
                                                        alt={`Preview ${index + 1}`}
                                                        fill
                                                        style={{ objectFit: "cover" }}
                                                    />

                                                    {/* Uploading indicator */}
                                                    {uploadingImages.has(index) && (
                                                        <div
                                                            className="position-absolute top-50 start-50 translate-middle"
                                                            style={{
                                                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                                                                color: "#fff",
                                                                padding: "8px",
                                                                borderRadius: "4px",
                                                                zIndex: 10,
                                                            }}
                                                        >
                                                            <div className="spinner-border spinner-border-sm" role="status">
                                                                <span className="visually-hidden">Uploading...</span>
                                                            </div>
                                                        </div>
                                                    )}

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
                                                    {!uploadingImages.has(index) && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeImage(index);
                                                            }}
                                                            onMouseDown={(e) => e.stopPropagation()}
                                                            style={{ zIndex: 100 }}
                                                        >
                                                            <i className="ri-close-line" />
                                                        </button>
                                                    )}

                                                    {/* Set as Main Button */}
                                                    {mainImageIndex !== index && !uploadingImages.has(index) && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-warning position-absolute bottom-0 start-0 m-1"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setAsMainImage(index);
                                                            }}
                                                            onMouseDown={(e) => e.stopPropagation()}
                                                            style={{ zIndex: 10 }}
                                                        >
                                                            <i className="ri-star-line" />
                                                        </button>
                                                    )}

                                                    {/* Drag Handle */}
                                                    {!uploadingImages.has(index) && (
                                                        <div
                                                            className="position-absolute bottom-0 end-0 m-1"
                                                            style={{
                                                                backgroundColor: "rgba(0, 0, 0, 0.6)",
                                                                color: "#fff",
                                                                padding: "4px 8px",
                                                                borderRadius: "4px",
                                                                fontSize: "12px",
                                                                zIndex: 10,
                                                                cursor: "grab",
                                                            }}
                                                        >
                                                            <i className="ri-drag-move-2-line" /> {index + 1}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <p className="text-muted mb-0">
                                            {uploadedImages.length} / 15 images selected
                                        </p>
                                        <p className="text-muted mb-0 small">
                                            <i className="ri-information-line" /> Drag images to reorder • Click the star icon to set main image
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
                            <RichTextEditor
                                value={formData.exterior_description}
                                onChange={(value) => handleFieldChange("exterior_description", value)}
                                rows={4}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Additional Details</label>
                            <RichTextEditor
                                value={formData.additional_details}
                                onChange={(value) => handleFieldChange("additional_details", value)}
                                rows={6}
                            />
                            <small className="text-muted mt-2 d-block">
                                Use the toolbar above to format your text with styles, lists, links, and more.
                            </small>
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

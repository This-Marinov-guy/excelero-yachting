// Boat filter data

export const VatIncludedData = [
  { id: "vat-yes", label: "VAT Included", type: "vat_included", value: "true" },
  { id: "vat-no", label: "VAT Not Included", type: "vat_included", value: "false" },
];

// These will be populated dynamically from actual boat data
export const BoatManufacturerData: { id: string; label: string; type: string }[] = [];
export const BoatDesignerData: { id: string; label: string; type: string }[] = [];
export const BoatLocationData: { id: string; label: string; type: string }[] = [];

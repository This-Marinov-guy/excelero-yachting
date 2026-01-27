
import { FC } from "react";
import { ProductType } from "@/types/Product";
import { Button } from "reactstrap";
import Image from "next/image";
import { Mail } from "lucide-react";

interface BoatDetailSidebarProps {
    boat: ProductType;
}

const BoatDetailSidebar: FC<BoatDetailSidebarProps> = ({ boat }) => {
    return (
        <div className="detail-sidebar">
            <div className="detail-sub-sidebar">
                {/* Contact Information */}
                <div className="sidebar-box">
                    <h5 className="mb-3">Contact Information</h5>

                    {/* Dealer Profile Image */}
                    {boat.brokerProfileImage && (
                        <div className="dealer-profile-image mb-3" style={{ textAlign: 'center' }}>
                            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto', borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(var(--theme-color), 0.2)' }}>
                                <Image
                                    src={boat.brokerProfileImage}
                                    alt={boat.dealer || "Brokerage"}
                                    fill
                                    className="object-contain"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    )}

                    {boat.brokerName && (
                        <div className="contact-item mb-2">
                            <strong>Broker Name:</strong> <span>{boat.brokerName}</span>
                        </div>
                    )}

                    {boat.dealer && (
                        <div className="contact-item mb-2">
                            <strong>Company:</strong> <span>{boat.dealer}</span>
                        </div>
                    )}
                    {boat.brokerEmail && (
                        <div className="contact-item mb-2">
                            <strong>Email:</strong>{" "}
                            <a href={`mailto:${boat.brokerEmail}`}>{boat.brokerEmail}</a>
                        </div>
                    )}
                    {boat.brokerPhone && (
                        <div className="contact-item mb-2">
                            <strong>Phone:</strong>{" "}
                            <a href={`tel:${boat.brokerPhone}`}>{boat.brokerPhone}</a>
                        </div>
                    )}
                    {boat.brokerEmail && (
                        <Button className="btn-solid w-100 mt-3" onClick={() => window.location.href = `mailto:${boat.brokerEmail}`}>
                            <Mail className="h-4 w-4 me-2" style={{ display: 'inline-block' }} />
                            Contact Dealer
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BoatDetailSidebar;

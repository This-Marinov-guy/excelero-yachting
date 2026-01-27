"use client";
import CloseBtn from "@/components/commonComponents/CloseBtn";
import { SocialLinks } from "@/data/demo/common";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setShareModal } from "@/redux/reducers/LayoutSlice";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button, Input, Modal, ModalBody, ModalHeader } from "reactstrap";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

const ShareModal = () => {
  const { shareModal } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (shareModal && typeof window !== "undefined") {
      const currentUrl = `${window.location.origin}${pathname}`;
      setInputValue(currentUrl);
    }
  }, [shareModal, pathname]);

  const toggle = () => dispatch(setShareModal());
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inputValue);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("Failed to copy link");
    }
  };
  return (
    <>
      <Modal fade centered modalClassName='theme-modal' isOpen={shareModal} toggle={toggle}>
        <ModalHeader toggle={toggle} close={<CloseBtn toggle={toggle} />} />
        <ModalBody>
          <h4 className='modal-title'>Share It</h4>
          <ul className='modal-share-list'>
            {SocialLinks.map((link, index) => {
              const shareUrl = (() => {
                if (!inputValue) return link.url;
                const encodedUrl = encodeURIComponent(inputValue);
                const encodedTitle = encodeURIComponent(
                  typeof window !== "undefined" ? document.title || "Check out this boat" : "Check out this boat"
                );
                switch (link.name) {
                  case "Facebook":
                    return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                  case "Twitter":
                    return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
                  case "LinkedIn":
                    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
                  case "WhatsApp":
                    return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
                  case "Email":
                    return `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
                  default:
                    return link.url;
                }
              })();
              return (
                <li key={index}>
                  <Link href={shareUrl} target='_blank' rel='noopener noreferrer'>
                    <i className={link.iconClass}></i>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className='d-flex align-items-center position-relative copy-input'>
            <Input type='text' value={inputValue} onChange={(event) => setInputValue(event.target.value)} />
            <Button className='btn-solid position-absolute top-0 end-0' onClick={handleCopy}>
              Copy Link
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ShareModal;

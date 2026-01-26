"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setLogoutModal } from "@/redux/reducers/LayoutSlice";
import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import CloseBtn from "../CloseBtn";
import { Cancel, Logout, LogoutContent, LogoutTitle, SVGPath } from "@/constants";
import { RouteList } from "@/utils/RouteList";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ModalLogout = () => {
  const { logoutModal } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const supabase = getSupabaseBrowserClient();

  const toggle = () => {
    if (!signingOut) {
      dispatch(setLogoutModal());
    }
  };

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Signed out successfully");
      dispatch(setLogoutModal());
      router.push(RouteList.Auth.SignIn);
    } catch (err: any) {
      toast.error(err?.message || "Failed to sign out. Please try again.");
      setSigningOut(false);
    }
  };

  return (
    <Modal fade centered className='theme-modal' isOpen={logoutModal} toggle={toggle}>
      <div className='modal-dialog modal-dialog-centered'>
        <div className='modal-content'>
          <ModalHeader toggle={toggle} close={<CloseBtn toggle={toggle} />} />
          <ModalBody>
            {/* <div className='logout-img'>
              <img src={`${SVGPath}/other/logout.svg`} alt='logout' className='img-fluid d-block mx-auto' />
            </div> */}
            <div className='logout-content'>
              <h4 className='text-center'>{LogoutTitle}</h4>
              <p className='text-center'>{LogoutContent}</p>
              <div className='d-flex align-items-center justify-content-center gap-2'>
                <Button 
                  className='btn-border' 
                  onClick={toggle}
                  disabled={signingOut}
                >
                  {Cancel}
                </Button>
                <Button 
                  className='btn-solid danger' 
                  onClick={handleLogout}
                  disabled={signingOut}
                >
                  {signingOut ? "Signing out..." : Logout}
                </Button>
              </div>
            </div>
          </ModalBody>
        </div>
      </div>
    </Modal>
  );
};

export default ModalLogout;

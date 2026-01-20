import { Call, Location, Sms } from "iconsax-react";
import { FooterDetailType } from "@/types/Layout";
import { RouteList } from "@/utils/RouteList";
import { 
  MAIN_CONTACT_NUMBER, 
  MAIN_CONTACT_EMAIL, 
  MAIN_CONTACT_LOCATION,
  INSTAGRAM_URL,
  FACEBOOK_URL,
  LINKEDIN_URL
} from "@/utils/defines/CONTACTS";

export const HeaderClassMapFooter: { [key: string]: string } = {
  "car-2": "car2-footer",
  "job-2": "dark-footer-section section-t-space",
  "property-2": "property2-footer",
};

export const Details = [
  'Exelero Yachting - Yachting and more.',
  'Experience excellence in yachting with personalized service and world-class expertise.'
];

export const Copyright =( <div className='copyright'>
  <p>@ {new Date().getFullYear()} Exelero Yachting. All Rights Reserved</p>
</div>)

export const ContactListData = [
  { icon: <Call className="iconsax"/>, title: "Call", text: MAIN_CONTACT_NUMBER },
  { icon: <Sms className="iconsax"/>, title: "Email", text: MAIN_CONTACT_EMAIL },
  { icon: <Location className="iconsax"/>, title: "Location", text: MAIN_CONTACT_LOCATION },
];

export const SocialMediaData = [
  { url: INSTAGRAM_URL, icon: "ri-instagram-line" },
  { url: FACEBOOK_URL, icon: "ri-facebook-line" },
  { url: LINKEDIN_URL, icon: "ri-linkedin-line" },
];

export const FooterDetailData: FooterDetailType[] = [
  {
    title: "Navigation",
    links: [
      { title: "Boats", url: RouteList.Pages.Boats },
      { title: "Gallery", url: RouteList.Pages.Gallery },
      { title: "About", url: RouteList.Pages.About },
      { title: "Contact", url: RouteList.Pages.Other.ContactUs1 },
    ],
  },
  {
    title: "Partners",
    links: [
      { title: "X-Yachts", url: RouteList.Pages.Partners.XYachts },
      { title: "Elvstrom", url: RouteList.Pages.Partners.Elvstrom },
      { title: "Omaya Yachts", url: RouteList.Pages.Partners.OmayaYachts },
    ],
  },
  {
    title: "Services",
    links: [
      { title: "Sails", url: RouteList.Pages.Services.Sails },
      { title: "Clothes", url: RouteList.Pages.Services.Clothes },
      { title: "Boats", url: RouteList.Pages.Services.Boats },
      { title: "Transportation", url: RouteList.Pages.Services.Transportation },
      { title: "Sell Your Boat", url: RouteList.Pages.Services.SellYourBoat },
      { title: "Charters", url: RouteList.Pages.Services.Charters },
      { title: "Parts", url: RouteList.Pages.Services.Parts },
    ],
  },
  {
    title: "Contact Info",
    contactList: true,
    links: [
      { title: MAIN_CONTACT_LOCATION, icon: "ri-map-pin-fill" },
      { title: MAIN_CONTACT_NUMBER, icon: "ri-phone-fill" },
      { title: MAIN_CONTACT_EMAIL, icon: "ri-mail-fill" },
    ],
  },
];

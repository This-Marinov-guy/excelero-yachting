import { RouteList } from "@/utils/RouteList";

export const Cities = ["Amsterdam", "Ankara", "Athens", "Atlantic", "Baltimore", "Bangkok", "Beijing", "Berlin", "Berne", "Brussels", "Budapest", "Buenos Aires", "Cairo", "Canberra", "Cannes", "Cape Town", "Chicago", "Cologne", "Copenhagen", "Damascus", "Delhi", "Dubai", "Dublin", "Florence", "Hague", "Havana", "Helsinki", "Hong Kong", "Honolulu", "Istanbul", "Jakarta", "Jerusalem", "Kansas City", "Kathmandu", "Kuala Lumpur", "Lisbon", "London", "Los Angeles", "Luxembourg", "Madrid", "Manila", "Melbourne", "Milan", "Montreal", "Moscow", "Munich", "Nazareth", "New York", "Nice", "Osaka", "Ottawa", "Paris", "Philadelphia", "Phnom Penh", "Prague", "Quito", "Reykjavik", "Rio de Janeiro", "San Francisco", "Santa Fe", "Santiago", "Shanghai", "Singapore City", "Stockholm", "Saint Petersburg", "Seoul", "Sydney", "Taipei", "Toronto", "Venice", "Vienna", "Washington", "Armenia", "Argentina", "Australia", "Aruba", "Belize", "Burundi", "Cape Verde", "Wokha", "Chile", "Ethiopia", "Zunheboto"];

export const HeaderClassMap: { [key: string]: string } = {
  "car-2": " car-top-header",
  job: " job-header",
  "job-2": " dark-job-header",
  "job-3": " job3-header",
  "property-2": " position-relative p-0",
};

export const ContainerClassMap: { [key: string]: string } = {
  "car-2": "car2-header",
  "property-2": "property2-header",
};

export const SearchModalData: { [key: string]: string } = {
  car: "car",
  property: "property",
  "property-2": "property",
  job: "job",
  "job-2": "job",
  "job-3": "job",
};

export const MenuItem = [
  {
    title: "About",
    type: "link",
    path: RouteList.Pages.About,
    active: false,
  },
  {
    title: "Brokerage",
    type: "link",
    path: RouteList.Pages.Boats,
    active: false,
  },
  // {
  //   title: "Gallery",
  //   type: "link",
  //   path: RouteList.Pages.Gallery,
  //   active: false,
  // },
  
  {
    title: "Partners",
    type: "sub",
    active: false,
    megaMenuImage: true,
    children: [
      {
        title: "X-Yachts",
        type: "link",
        path: RouteList.Pages.Partners.XYachts,
        image: "logo/x-yachts.png",
        active: false,
      },
       {
        title: "Omaya Yachts",
        type: "link",
        path: RouteList.Pages.Partners.OmayaYachts,
        image: "logo/omaya-yachts.jpg",
        active: false,
      },
      {
        title: "Elvstrom",
        type: "link",
        path: RouteList.Pages.Partners.Elvstrom,
        image: "logo/elvstrom.jpg",
        active: false,
      },
      {
        title: "Elvstrom SailWear",
        type: "link",
        path: RouteList.Pages.Partners.ElvstromSailWear,
        image: "logo/elvstrom-sailwear.webp",
        active: false,
      },
     
      {
        title: "Zhik",
        type: "link",
        path: RouteList.Pages.Partners.Zhik,
        image: "logo/zhik.jpg",
        active: false,
      },
    ],
  },
  {
    title: "Services",
    type: "sub",
    active: false,
    children: [
      {
        title: "Sails",
        type: "link",
        path: RouteList.Pages.Services.Sails,
        active: false,
      },
      {
        title: "Clothes",
        type: "link",
        path: RouteList.Pages.Services.Clothes,
        active: false,
      },
      {
        title: "Brokerage",
        type: "link",
        path: RouteList.Pages.Services.Boats,
        active: false,
      },
      {
        title: "Transportation",
        type: "link",
        path: RouteList.Pages.Services.Transportation,
        active: false,
      },
      // {
      //   title: "Sell Your Boat",
      //   type: "link",
      //   path: RouteList.Pages.Services.SellYourBoat,
      //   active: false,
      // },
      {
        title: "Charters",
        type: "link",
        path: RouteList.Pages.Services.Charters,
        active: false,
      },
      {
        title: "Parts",
        type: "link",
        path: RouteList.Pages.Services.Parts,
        active: false,
      },
    ],
  },
  {
    title: "Contact",
    type: "link",
    path: RouteList.Pages.Other.ContactUs1,
    active: false,
  },
];

export const AccountData = ["All Rides", "My Account", "Saved Rides", "Privacy", "Searches", "Recommendations", "My Profile"];

export const LanguagesData = [
  { data: "en", language: "English" },
  { data: "sp", language: "Spanish" },
  { data: "fr", language: "French" },
  { data: "ge", language: "German" },
  { data: "ko", language: "Korean" },
];

export const SocialLinks = [
  { href: "https://www.facebook.com/", icon: "ri-facebook-fill" },
  { href: "https://x.com/", icon: "ri-twitter-x-line" },
  { href: "https://www.instagram.com/", icon: "ri-instagram-line" },
  { href: "https://www.youtube.com/", icon: "ri-youtube-fill" },
];

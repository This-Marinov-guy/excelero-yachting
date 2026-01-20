/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import "../index.scss";
import { I18nProvider } from "./i18n/i18n-context";
import { detectLanguage } from "./i18n/server";
import { Providers } from "./MainProvider";

export const metadata: Metadata = {
  title: "Exelero Yachting",
  description: "Exelero Yachting",
  icons: {
    icon: "/assets/images/favicons/favicon.ico",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const lng = await detectLanguage();

  return (
    <html lang={lng}>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link href='https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap' rel='stylesheet' />
      </head>
      <body suppressHydrationWarning={true}>
        <I18nProvider language={lng}>
          <Providers>{children}</Providers>
        </I18nProvider>
      </body>
    </html>
  );
}

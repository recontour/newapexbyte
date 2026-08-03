import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Required for env(safe-area-inset-*) so bottom CTAs clear the home indicator
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "ApexByte — We shape your ideas",
  description:
    "An uncompromisingly minimalist digital experience crafted with immersive WebGL parallax, boutique mobile-first interfaces, and calm, cinematic aesthetics.",
  keywords: [
    "ApexByte",
    "Digital Studio",
    "Boutique Web Development",
    "Minimalist UI UX",
    "WebGL Parallax",
    "Mobile-First Experiences",
    "Custom Restaurant Menus",
  ],
  authors: [{ name: "ApexByte" }],
  creator: "ApexByte",
  publisher: "ApexByte",
  metadataBase: new URL("https://apexbyte.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ApexByte — We shape your ideas",
    description:
      "An uncompromisingly minimalist digital experience crafted with immersive WebGL parallax and calm, cinematic aesthetics.",
    url: "https://apexbyte.com",
    siteName: "ApexByte",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/OGimage.png",
        width: 1200,
        height: 630,
        alt: "ApexByte — We shape your ideas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ApexByte — We shape your ideas",
    description:
      "An uncompromisingly minimalist digital experience crafted with immersive WebGL parallax and calm, cinematic aesthetics.",
    images: ["/OGimage.png"],
    creator: "@apexbyte",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/OGimage.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ApexByte",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

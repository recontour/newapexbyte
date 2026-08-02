import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ApexByte — We shape your ideas",
  description:
    "An uncompromisingly minimalist digital experience crafted with immersive WebGL parallax and calm, cinematic aesthetics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
      </head>
      <body>{children}</body>
    </html>
  );
}

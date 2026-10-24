import type { Metadata, Viewport } from "next";
import { artist } from "@/config/artist";
import "./globals.css";

const socialImage = artist.imageWide ?? artist.image;

export const metadata: Metadata = {
  title: `${artist.name}`,
  description: artist.subline || artist.tagline,
  openGraph: {
    title: artist.name,
    description: artist.subline || artist.tagline,
    type: "website",
    images: socialImage ? [socialImage] : undefined,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: artist.background,
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      style={
        {
          "--bg": artist.background,
          "--fg": artist.foreground,
          "--accent": artist.accent,
        } as React.CSSProperties
      }
    >
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}

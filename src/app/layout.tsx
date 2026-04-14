import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareReady MVP",
  description: "Non-clinical caregiver support UI prototype"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

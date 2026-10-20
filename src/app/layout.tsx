import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Township Flood Intelligence | Prototype",
  description: "Hackathon prototype for township flood-related situational awareness and road-access assessment.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

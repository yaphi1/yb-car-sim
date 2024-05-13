import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YB Car Sim",
  description: "Based on a tutorial at https://youtu.be/lcMCVWYpnrI?si=A9rIz7n1mGxFxCp5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abby Ramadan",
  description: "Capital markets professional with expertise in structured finance, regulatory compliance, and data-driven decision making.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

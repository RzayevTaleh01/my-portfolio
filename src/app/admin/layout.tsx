import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/** Separate root layout: the admin panel has none of the site's chrome. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} min-h-dvh bg-background font-sans text-foreground antialiased`}>{children}</body>
    </html>
  );
}

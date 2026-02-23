import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base44 • Turn your ideas into apps",
  description: "Build fully-functional apps in minutes with just your words. No coding necessary.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='%23FF6B35'/></svg>" />
      </head>
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  );
}

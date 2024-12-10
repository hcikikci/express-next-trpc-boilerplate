import type { Metadata } from "next";
import "./globals.css";
import { TrpcProvider } from "@/utils/trpc-provider";

export const metadata: Metadata = {
  title: "Agile SaaSKit",
  description: "Modern SaaS Starter Kit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <TrpcProvider>{children}</TrpcProvider>
      </body>
    </html>
  );
}

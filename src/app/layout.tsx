import type { Metadata } from "next"
import "./globals.css"
import SiteNavbar from "@/components/site-navbar"

export const metadata: Metadata = {
  title: "Ifada Qirat Center",
  description: "Quran and Kitab student tracking system",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f7f8f4] text-slate-900">
        <SiteNavbar />
        {children}
      </body>
    </html>
  )
}
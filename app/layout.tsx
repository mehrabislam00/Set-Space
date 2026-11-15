import type { Metadata } from "next"
import { DM_Sans, Geist_Mono, Manrope } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/Navbar/navbar"
import { Footer } from "@/components/Footer/Footer"

// Body font
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" })
// Headings (use the `font-heading` class)
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: "SetSpace — Create. Rent. Inspire.",
  description:
    "Rent premium studios for photography, filmmaking, podcasting, music production, and more.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        dmSans.variable,
        manrope.variable,
        geistMono.variable
      )}
    >
      <body>
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
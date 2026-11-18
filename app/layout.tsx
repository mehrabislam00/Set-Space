import type { Metadata } from "next"
import { DM_Sans, Geist_Mono, Manrope } from "next/font/google"

import logo from "@/assets/logo.svg"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/Navbar/navbar"
import { Footer } from "@/components/Footer/Footer"
import { PageTransition } from "@/components/Animation/Page-transition"
import { SiteChrome } from "@/components/Auth/Site-chrome"
import { AccountProfileProvider } from "@/components/Dashboard/Account-profile-provider"
import { WishlistProvider } from "@/components/Dashboard/Wishlist-provider"
import { NotificationsProvider } from "@/components/Notifications/Notifications-provider"
import { Toaster } from "@/components/ui/toast"

// Body font
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" })
// Headings (use the `font-heading` class)
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" })
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "SetSpace — Create. Rent. Inspire.",
  description:
    "Rent premium studios for photography, filmmaking, podcasting, music production, and more.",
  icons: {
    icon: [{ url: logo.src, type: "image/svg+xml" }],
    shortcut: [{ url: logo.src, type: "image/svg+xml" }],
  },
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
      <body className="flex min-h-svh flex-col">
        <ThemeProvider>
          <AccountProfileProvider>
            <WishlistProvider>
              <NotificationsProvider>
                <SiteChrome>
                  <Navbar />
                </SiteChrome>
                <PageTransition>{children}</PageTransition>
              </NotificationsProvider>
            </WishlistProvider>
          </AccountProfileProvider>
          <Toaster />
          <SiteChrome>
            <Footer />
          </SiteChrome>
        </ThemeProvider>
      </body>
    </html>
  )
}

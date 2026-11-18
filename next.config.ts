import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async rewrites() {
    const apiUrl = (
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    )
      .trim()
      .replace(/\/+$/, "")

    return [
      {
        source: "/api/backend/:path*",
        destination: `${apiUrl}/:path*`,
      },
      // The app folder is named `dashbord` but every link uses /dashboard.
      // This serves /dashboard, /dashboard/bookings, ... from that folder while
      // the address bar keeps the correct spelling. Delete this rewrite if you
      // rename app/dashbord to app/dashboard.
      { source: "/dashboard/:path*", destination: "/dashbord/:path*" },
    ]
  },
}

export default nextConfig
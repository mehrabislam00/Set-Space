import { MyStudios } from "@/components/Host/My-studios"
import type { Metadata } from "next"



export const metadata: Metadata = {
  title: "Manage My Studios — SetSpace",
  description: "Publish, unpublish and manage your studio listings on SetSpace.",
}

export default function MyStudiosPage() {
  return <MyStudios />
}
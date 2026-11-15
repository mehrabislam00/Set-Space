import Image from "next/image"
import Link from "next/link"
import { FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa"

import logo from "@/assets/logo.svg"
import { Container } from "../Container/Container"
import { footerColumns, legalLinks } from "@/lib/Site-data"
import { NewsletterForm } from "./Newsletter-form"


const socials = [
  { label: "Twitter", href: "#", icon: FaTwitter },
  { label: "YouTube", href: "#", icon: FaYoutube },
  { label: "Instagram", href: "#", icon: FaInstagram },
  { label: "LinkedIn", href: "#", icon: FaLinkedinIn },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.4fr]">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <Image src={logo} alt="SetSpace logo" className="size-8" />
            <span className="leading-none">
              <span className="block font-heading text-base font-bold text-foreground">
                Set<span className="text-primary">Space</span>
              </span>
              <span className="mt-1 block text-[9px] text-muted-foreground">
                Create. Rent. Inspire.
              </span>
            </span>
          </Link>
          <p className="mt-5 max-w-56 text-xs leading-relaxed text-muted-foreground">
            A creative studio marketplace for creators, by creators.
          </p>
          <div className="mt-6 flex gap-2">
            {socials.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="size-3.5" />
              </Link>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {footerColumns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="font-heading text-xs font-bold text-foreground">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        {/* Newsletter */}
        <div>
          <h3 className="font-heading text-xs font-bold text-foreground">
            Stay Updated
          </h3>
          <p className="mt-4 mb-4 max-w-56 text-xs leading-relaxed text-muted-foreground">
            Get new studios and creator stories in your inbox.
          </p>
          <NewsletterForm />
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">
          <p className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} SetSpace. All rights reserved.
          </p>
          <ul className="flex gap-5">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-[11px] text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  )
}
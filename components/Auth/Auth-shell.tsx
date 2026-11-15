import { ArrowLeft } from "lucide-react"
import Image, { type StaticImageData } from "next/image"
import Link from "next/link"

import logo from "@/assets/logo.svg"
import { AuthThemeToggle } from "./Auth-theme-toggle"

type AuthShellProps = {
  title: string
  description: string
  image: StaticImageData
  imageAlt: string
  eyebrow: string
  headline: string
  children: React.ReactNode
}

/** Split-screen frame shared by Login / Register / Forgot password:
 *  photo + tagline on the left (lg and up), logo + heading + form on the right. */
export function AuthShell({
  title,
  description,
  image,
  imageAlt,
  eyebrow,
  headline,
  children,
}: AuthShellProps) {
  // z-[60] keeps the page above the fixed Navbar (z-50) so it is always clickable
  return (
    <main className="relative z-[60] grid min-h-svh bg-background lg:grid-cols-2">
      {/* Photo panel */}
      <aside className="relative isolate hidden overflow-hidden lg:block">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="50vw"
          className="img-in -z-20 object-cover"
        />
        {/* darkening layers keep the text readable in both themes */}
        <div className="absolute inset-0 -z-10 bg-black/55" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-transparent to-black/30" />

        <div className="stagger-in absolute inset-x-0 bottom-0 p-10 xl:p-12">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
            {eyebrow}
          </p>
          <p className="mt-3 max-w-md font-heading text-3xl leading-tight font-extrabold tracking-tight text-photo">
            {headline}
          </p>
        </div>
      </aside>

      {/* Form panel */}
      <section className="relative flex min-h-svh flex-col">
        <div className="relative z-10 flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-6 lg:px-10">
          <Link
            href="/"
            className="group flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors duration-300 hover:text-primary"
          >
            <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transition-none" />
            Back home
          </Link>
          <AuthThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[22rem]">
            <div className="stagger-in text-center">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <Image src={logo} alt="SetSpace logo" priority className="size-9" />
                <span className="text-left leading-none">
                  <span className="block font-heading text-lg font-bold text-foreground">
                    Set<span className="text-primary">Space</span>
                  </span>
                  <span className="mt-1 block text-[10px] text-muted-foreground">
                    Create. Rent. Inspire.
                  </span>
                </span>
              </Link>

              <h1 className="mt-8 font-heading text-3xl font-extrabold tracking-tight text-foreground">
                {title}
              </h1>
              <p className="mt-2 text-xs text-muted-foreground">{description}</p>
            </div>

            {children}
          </div>
        </div>
      </section>
    </main>
  )
}
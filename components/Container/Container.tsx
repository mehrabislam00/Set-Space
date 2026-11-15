import { cn } from "@/lib/utils"

/** Shared page width. Change max-w here to resize every section at once. */
export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12", className)}
      {...props}
    />
  )
}
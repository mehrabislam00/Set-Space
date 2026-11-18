export { cn } from "cn"

const takaFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function formatTaka(amount: number) {
  return takaFormatter.format(amount)
}

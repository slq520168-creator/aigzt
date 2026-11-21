import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** One choice from a row of chips, a list's filter ("All · Open · Done"). Controlled. */
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: ReadonlyArray<T | { value: T; label: string }>
  value: T
  onChange: (value: T) => void
  /** What the row filters, for a screen reader: "Status". */
  label: string
  className?: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("flex max-w-full gap-2 overflow-x-auto [scrollbar-width:none]", className)}>
      {options.map((option) => {
        const item = typeof option === "string" ? { value: option, label: option } : option
        const selected = item.value === value
        return (
          <Button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={selected}
            variant={selected ? "secondary" : "outline"}
            size="sm"
            className="shrink-0 rounded-full px-3.5"
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </Button>
        )
      })}
    </div>
  )
}

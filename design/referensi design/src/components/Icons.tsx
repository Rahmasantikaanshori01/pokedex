import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement>

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
}

export const SearchIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)
export const XIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m18 6-12 12M6 6l12 12" />
  </svg>
)
export const ArrowLeftIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m15 18-6-6 6-6" />
  </svg>
)
export const ArrowRightIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m9 18 6-6-6-6" />
  </svg>
)
export const MenuIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)
export const CheckIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m5 12 4 4L19 6" />
  </svg>
)
export const AlertIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5M12 17h.01" />
  </svg>
)

export function PokeballIcon({ className = "", ...props }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9.5" fill="currentColor" />
      <path d="M2.5 12h19" stroke="white" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.2" fill="white" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
    </svg>
  )
}

export function EmptyPokeball() {
  return (
    <svg
      className="empty-illustration"
      viewBox="0 0 160 130"
      role="img"
      aria-label="An open Pokéball illustration"
    >
      <ellipse cx="80" cy="118" rx="53" ry="8" fill="#d9dde3" opacity=".55" />
      <path d="M30 68a50 50 0 0 1 100 0H30Z" fill="#f36b6b" />
      <path d="M30 68a50 50 0 0 0 100 0H30Z" fill="white" />
      <path d="M30 68h100" stroke="#24262b" strokeWidth="8" />
      <circle
        cx="80"
        cy="68"
        r="17"
        fill="white"
        stroke="#24262b"
        strokeWidth="7"
      />
      <circle cx="80" cy="68" r="7" fill="#eef0f3" />
      <path
        d="m102 26 7-12m6 24 14-5m-31-19 1-10"
        stroke="#f1b933"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}

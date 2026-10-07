const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const SearchIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const XIcon = (props) => (
  <svg {...base} {...props}>
    <path d="m18 6-12 12M6 6l12 12" />
  </svg>
);

export const ArrowLeftIcon = (props) => (
  <svg {...base} {...props}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const ArrowRightIcon = (props) => (
  <svg {...base} {...props}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const MenuIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CheckIcon = (props) => (
  <svg {...base} {...props}>
    <path d="m5 12 4 4L19 6" />
  </svg>
);

export const AlertIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5M12 17h.01" />
  </svg>
);

export function PokeballIcon({ className = "", width = 24, height = 24, ...props }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <g>
        {/* Hemisfer Atas (Merah) */}
        <path d="M 4 50 A 46 46 0 0 1 96 50 Z" fill="#eb2d2d" />
        {/* Shading/Bayangan Sphere Hemisfer Atas */}
        <path
          d="M 50 4 A 46 46 0 0 1 96 50 A 41 41 0 0 0 50 9 Z"
          fill="#c41c1c"
          opacity="0.45"
        />

        {/* Hemisfer Bawah (Putih) */}
        <path d="M 4 50 A 46 46 0 0 0 96 50 Z" fill="#ffffff" />
        {/* Shading/Bayangan Sphere Hemisfer Bawah */}
        <path
          d="M 8 50 A 42 42 0 0 0 92 50 A 46 46 0 0 1 8 50 Z"
          fill="#d1d5db"
          opacity="0.85"
        />

        {/* Garis Pembagi Tengah (Hitam) */}
        <path d="M 3.8 46.5 H 96.2 V 53.5 H 3.8 Z" fill="#1c1e22" />

        {/* Cincin Luar Tombol Tengah (Hitam) */}
        <circle cx="50" cy="50" r="16.5" fill="#1c1e22" />

        {/* Cincin Putih Tombol Tengah */}
        <circle cx="50" cy="50" r="11" fill="#ffffff" />

        {/* Tombol Tengah (Charcoal Black) */}
        <circle cx="50" cy="50" r="6.5" fill="#2c2e33" />

        {/* Garis Lingkar Luar (Hitam Tebal) */}
        <circle
          cx="50"
          cy="50"
          r="46.5"
          fill="none"
          stroke="#1c1e22"
          strokeWidth="7"
        />
      </g>
    </svg>
  );
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
  );
}

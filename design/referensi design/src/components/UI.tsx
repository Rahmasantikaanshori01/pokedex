import { Link, NavLink, Outlet } from "react-router"
import { useState, type ReactNode } from "react"
import { artworkUrl, formatPokemonId, type Pokemon } from "../data/pokemon"
import { usePokedex } from "../app/PokedexContext"
import {
  AlertIcon,
  ArrowRightIcon,
  CheckIcon,
  EmptyPokeball,
  MenuIcon,
  PokeballIcon,
  SearchIcon,
  XIcon,
} from "./Icons"

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { toast, clearToast } = usePokedex()
  const links = [
    ["/", "Home"],
    ["/collection", "My Pokémon"],
    ["/history", "History"],
  ]
  return (
    <div className="app-shell">
      <header className="navbar">
        <div className="nav-inner">
          <Link to="/" className="logo" aria-label="Pokédex home">
            <PokeballIcon />
            <span>
              Poké<span>dex</span>
            </span>
          </Link>
          <button
            className="menu-button icon-button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <XIcon /> : <MenuIcon />}
          </button>
          <nav
            className={`nav-links ${menuOpen ? "is-open" : ""}`}
            aria-label="Main navigation"
          >
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="nav-charm" aria-hidden="true">
            <PokeballIcon />
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <PokeballIcon />
        <span>Pokédex Project</span>
        <small>Discover. Catch. Remember.</small>
      </footer>
      {toast && (
        <div className={`toast toast-${toast.tone}`} role="status">
          <span className="toast-icon">
            {toast.tone === "success" ? <CheckIcon /> : <AlertIcon />}
          </span>
          <span>{toast.message}</span>
          {toast.action?.href && (
            <Link to={toast.action.href} onClick={clearToast}>
              {toast.action.label}
            </Link>
          )}
          {toast.action?.onClick && (
            <button
              className="toast-action"
              onClick={() => {
                clearToast()
                toast.action?.onClick?.()
              }}
            >
              {toast.action.label}
            </button>
          )}
          <button onClick={clearToast} aria-label="Dismiss notification">
            <XIcon />
          </button>
        </div>
      )}
    </div>
  )
}

export function TypeBadge({ type }: { type: Pokemon["types"][number] }) {
  return <span className={`type-badge type-${type}`}>{type}</span>
}

export function PokemonCard({
  pokemon,
  action,
}: {
  pokemon: Pokemon
  action?: ReactNode
}) {
  return (
    <article className="pokemon-card">
      <Link
        to={`/pokemon/${pokemon.id}`}
        className="card-link"
        aria-label={`View ${pokemon.name}`}
      >
        <span className="pokemon-id">{formatPokemonId(pokemon.id)}</span>
        <div className={`pokemon-art type-bg-${pokemon.types[0]}`}>
          <img
            src={artworkUrl(pokemon.id)}
            alt={`${pokemon.name} official artwork`}
            loading="lazy"
          />
        </div>
        <div className="card-heading">
          <h2>{pokemon.name}</h2>
          <ArrowRightIcon />
        </div>
        <div className="type-row">
          {pokemon.types.map((type) => (
            <TypeBadge type={type} key={type} />
          ))}
        </div>
      </Link>
      {action && <div className="card-action">{action}</div>}
    </article>
  )
}

export function SearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="search-bar">
      <SearchIcon />
      <span className="sr-only">Search Pokémon</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by Pokémon name..."
      />
      {value && (
        <button onClick={() => onChange("")} aria-label="Clear search">
          <XIcon />
        </button>
      )}
    </label>
  )
}

export function SkeletonCard() {
  return (
    <div className="pokemon-card skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-id" />
      <div className="skeleton skeleton-art" />
      <div className="skeleton skeleton-name" />
      <div className="skeleton skeleton-badge" />
    </div>
  )
}

export function CardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="pokemon-grid" aria-label="Loading Pokémon">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  )
}

export function EmptyState({
  title,
  message,
  actionLabel,
  actionTo,
  onAction,
}: {
  title: string
  message?: string
  actionLabel: string
  actionTo?: string
  onAction?: () => void
}) {
  const content = (
    <>
      <EmptyPokeball />
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {actionTo ? (
        <Link className="button button-primary" to={actionTo}>
          {actionLabel}
        </Link>
      ) : (
        <button className="button button-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </>
  )
  return <section className="empty-state">{content}</section>
}

export function ErrorState({
  message,
  onRetry,
  showBack = false,
}: {
  message: string
  onRetry: () => void
  showBack?: boolean
}) {
  return (
    <section className="error-state">
      <span>
        <AlertIcon />
      </span>
      <h2>Something went wrong</h2>
      <p>{message}</p>
      <div>
        {showBack && (
          <Link className="button button-secondary" to="/">
            Back to list
          </Link>
        )}
        <button className="button button-primary" onClick={onRetry}>
          Try again
        </button>
      </div>
    </section>
  )
}

export function PageIntro({
  eyebrow,
  title,
  description,
  side,
}: {
  eyebrow?: string
  title: string
  description?: string
  side?: ReactNode
}) {
  return (
    <div className="page-intro">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {side}
    </div>
  )
}

export function ConfirmDialog({
  pokemon,
  busy,
  onCancel,
  onConfirm,
}: {
  pokemon: Pokemon
  busy: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onMouseDown={(event) =>
        event.target === event.currentTarget && !busy && onCancel()
      }
    >
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="release-title"
      >
        <button
          className="dialog-close icon-button"
          onClick={onCancel}
          disabled={busy}
          aria-label="Close dialog"
        >
          <XIcon />
        </button>
        <div className={`dialog-image type-bg-${pokemon.types[0]}`}>
          <img src={artworkUrl(pokemon.id)} alt="" />
        </div>
        <h2 id="release-title">Release {pokemon.name}?</h2>
        <p>
          They’ll leave your collection, but this moment will stay in your
          history.
        </p>
        <div className="dialog-actions">
          <button
            className="button button-secondary"
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            className="button button-danger"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Releasing..." : "Yes, release"}
          </button>
        </div>
      </div>
    </div>
  )
}

export function StatBar({ label, value }: { label: string value: number }) {
  return (
    <div className="stat-row">
      <span>{label}</span>
      <strong>{value}</strong>
      <div className="stat-track">
        <div
          className="stat-fill"
          style={{ width: `${Math.min(100, value / 1.6)}%` }}
        />
      </div>
    </div>
  )
}

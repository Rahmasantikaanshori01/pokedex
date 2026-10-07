import { useEffect, useMemo, useState } from "react"
import type { Pokemon } from "../data/pokemon"
import { pokemonService } from "../services/pokemonService"
import {
  CardGridSkeleton,
  EmptyState,
  ErrorState,
  PageIntro,
  PokemonCard,
  SearchBar,
} from "../components/UI"
import { PokeballIcon } from "../components/Icons"
import { artworkUrl, formatPokemonId } from "../data/pokemon"

const featuredPokemon = [
  { id: 1, name: "Bulbasaur", type: "Grass" },
  { id: 25, name: "Pikachu", type: "Electric" },
  { id: 7, name: "Squirtle", type: "Water" },
]

export default function HomePage() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const load = () => {
    setStatus("loading")
    pokemonService
      .getAll()
      .then((data) => {
        setPokemon(data)
        setStatus("ready")
      })
      .catch(() => setStatus("error"))
  }
  useEffect(load, [])
  const filtered = useMemo(
    () =>
      pokemon.filter((item) =>
        item.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [pokemon, query],
  )

  return (
    <div className="page">
      <section className="home-hero">
        <div className="featured-showcase">
          <div className="showcase-label">
            <span>Featured team</span>
            <strong>Choose your partner</strong>
          </div>
          <div className="featured-cards" aria-label="Featured Pokémon">
            {featuredPokemon.map((item, index) => (
              <div
                className={`featured-card featured-card-${index + 1}`}
                key={item.id}
              >
                <span>{formatPokemonId(item.id)}</span>
                <img src={artworkUrl(item.id)} alt="" />
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.type}</small>
                </div>
              </div>
            ))}
          </div>
          <span className="showcase-note">Swipe through the classics</span>
        </div>
        <div className="hero-copy">
          <span className="eyebrow">
            <PokeballIcon /> Gotta find ’em all
          </span>
          <h1>
            <span>Find your</span>
            <span>favorite</span>
            <em>Pokémon</em>
          </h1>
          <p>
            Meet every Pokémon, learn what makes them special, and build a team
            that feels completely yours.
          </p>
          <div className="hero-mascot" aria-hidden="true">
            <span>Hi, trainer!</span>
            <img src={artworkUrl(194)} alt="" />
          </div>
        </div>
        <div className="corner-pikachu" aria-hidden="true">
          <img
            src={artworkUrl(25)}
            alt=""
          />
        </div>
      </section>
      <section className="home-search-band">
        <div>
          <span className="eyebrow">Who are you looking for?</span>
          <h2>Search the Pokédex</h2>
        </div>
        <SearchBar value={query} onChange={setQuery} />
      </section>
      <section className="content-section">
        <PageIntro
          eyebrow="Explore the Pokédex"
          title={query ? `Results for “${query}”` : "Popular Pokémon"}
          side={
            status === "ready" && (
              <span className="result-count">{filtered.length} Pokémon</span>
            )
          }
        />
        {status === "loading" && <CardGridSkeleton />}
        {status === "error" && (
          <ErrorState
            message="We couldn't load the Pokédex right now."
            onRetry={load}
          />
        )}
        {status === "ready" && filtered.length > 0 && (
          <div className="pokemon-grid">
            {filtered.map((item) => (
              <PokemonCard pokemon={item} key={item.id} />
            ))}
          </div>
        )}
        {status === "ready" && filtered.length === 0 && (
          <EmptyState
            title="Pokémon not found"
            message="We searched every patch of tall grass. Try another name."
            actionLabel="Clear search"
            onAction={() => setQuery("")}
          />
        )}
      </section>
    </div>
  )
}

import { useCallback, useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import type { Pokemon } from "../data/pokemon"
import { artworkUrl, formatPokemonId } from "../data/pokemon"
import { pokemonService } from "../services/pokemonService"
import { usePokedex } from "../app/PokedexContext"
import { ArrowLeftIcon, PokeballIcon } from "../components/Icons"
import { ErrorState, StatBar, TypeBadge } from "../components/UI"

export default function DetailPage() {
  const { id } = useParams()
  const { catchPokemon, showToast } = usePokedex()
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [catching, setCatching] = useState(false)
  const load = useCallback(() => {
    setStatus("loading")
    pokemonService
      .getById(Number(id))
      .then((data) => {
        setPokemon(data)
        setStatus("ready")
      })
      .catch(() => setStatus("error"))
  }, [id])
  useEffect(load, [load])

  async function handleCatch() {
    if (!pokemon) return
    setCatching(true)
    try {
      const success = await catchPokemon(pokemon)
      if (!success)
        showToast({
          tone: "error",
          message: `Oh no! ${pokemon.name} escaped!`,
          action: { label: "Try again", onClick: handleCatch },
        })
    } finally {
      setCatching(false)
    }
  }

  if (status === "loading")
    return (
      <div className="page content-section">
        <Link className="back-link" to="/">
          <ArrowLeftIcon /> Back to list
        </Link>
        <div className="detail-skeleton">
          <div className="skeleton" />
          <div>
            <div className="skeleton" />
            <div className="skeleton" />
            <div className="skeleton" />
          </div>
        </div>
      </div>
    )
  if (status === "error" || !pokemon)
    return (
      <div className="page content-section">
        <ErrorState
          message="This Pokémon seems to have wandered away."
          onRetry={load}
          showBack
        />
      </div>
    )
  const statEntries = [
    ["HP", pokemon.stats.hp],
    ["Attack", pokemon.stats.attack],
    ["Defense", pokemon.stats.defense],
    ["Sp. Attack", pokemon.stats.specialAttack],
    ["Sp. Defense", pokemon.stats.specialDefense],
    ["Speed", pokemon.stats.speed],
  ] as const

  return (
    <div className="page detail-page content-section">
      <Link className="back-link" to="/">
        <ArrowLeftIcon /> Back to list
      </Link>
      <div className="detail-layout">
        <section className={`detail-visual type-bg-${pokemon.types[0]}`}>
          <span className="detail-number">{formatPokemonId(pokemon.id)}</span>
          <div className="visual-ring" />
          <img
            src={artworkUrl(pokemon.id)}
            alt={`${pokemon.name} official artwork`}
          />
          <div className="detail-dots" aria-hidden="true">
            •••
          </div>
        </section>
        <section className="detail-info">
          <span className="eyebrow">Pokémon profile</span>
          <div className="detail-title">
            <h1>{pokemon.name}</h1>
            <span>{formatPokemonId(pokemon.id)}</span>
          </div>
          <div className="type-row">
            {pokemon.types.map((type) => (
              <TypeBadge type={type} key={type} />
            ))}
          </div>
          <div className="measure-grid">
            <div>
              <span>Height</span>
              <strong>{pokemon.height} m</strong>
            </div>
            <div>
              <span>Weight</span>
              <strong>{pokemon.weight} kg</strong>
            </div>
          </div>
          <div className="info-block">
            <h2>Abilities</h2>
            <div className="ability-row">
              {pokemon.abilities.map((ability) => (
                <span key={ability}>{ability}</span>
              ))}
            </div>
          </div>
          <div className="info-block">
            <h2>Base stats</h2>
            <div className="stats-list">
              {statEntries.map(([label, value]) => (
                <StatBar key={label} label={label} value={value} />
              ))}
            </div>
          </div>
          <button
            className={`button button-primary catch-button ${
              catching ? "is-catching" : ""
            }`}
            onClick={handleCatch}
            disabled={catching}
          >
            <PokeballIcon />
            {catching ? "Catching..." : `Catch ${pokemon.name}`}
          </button>
        </section>
      </div>
    </div>
  )
}

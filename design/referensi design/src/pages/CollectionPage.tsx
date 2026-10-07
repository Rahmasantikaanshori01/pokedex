import { useState } from "react"
import type { Pokemon } from "../data/pokemon"
import { usePokedex } from "../app/PokedexContext"
import {
  CardGridSkeleton,
  ConfirmDialog,
  EmptyState,
  PageIntro,
  PokemonCard,
} from "../components/UI"
import { ArrowLeftIcon } from "../components/Icons"
import { Link } from "react-router"

export default function CollectionPage() {
  const { collection, releasePokemon, isStoreLoading, showToast } = usePokedex()
  const [selected, setSelected] = useState<Pokemon | null>(null)
  const [busy, setBusy] = useState(false)
  const confirmRelease = async () => {
    if (!selected) return
    setBusy(true)
    try {
      await releasePokemon(selected)
      setSelected(null)
    } catch (error) {
      showToast({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Release failed. Please try again.",
      })
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="page content-section">
      <PageIntro
        eyebrow="Your team"
        title="My Pokémon"
        description={
          isStoreLoading
            ? "Loading your team..."
            : `${collection.length} Pokémon caught`
        }
        side={
          <Link className="text-link" to="/">
            <ArrowLeftIcon /> Explore Pokémon
          </Link>
        }
      />
      {isStoreLoading && <CardGridSkeleton count={4} />}
      {!isStoreLoading && collection.length > 0 && (
        <div className="pokemon-grid">
          {collection.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              action={
                <button
                  className="button release-button"
                  onClick={() => setSelected(pokemon)}
                >
                  Release
                </button>
              }
            />
          ))}
        </div>
      )}
      {!isStoreLoading && collection.length === 0 && (
        <EmptyState
          title="You haven't caught any Pokémon yet"
          message="Your team is waiting to be discovered."
          actionLabel="Explore Pokémon"
          actionTo="/"
        />
      )}
      {selected && (
        <ConfirmDialog
          pokemon={selected}
          busy={busy}
          onCancel={() => setSelected(null)}
          onConfirm={confirmRelease}
        />
      )}
    </div>
  )
}

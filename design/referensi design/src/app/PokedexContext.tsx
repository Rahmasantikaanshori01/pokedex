import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Pokemon } from "../data/pokemon"
import { pokemonData } from "../data/pokemon"
import { pokemonService, type HistoryEntry } from "../services/pokemonService"

type ToastMessage = {
  id: number
  tone: "success" | "error"
  message: string
  action?: { label: string href?: string onClick?: () => void }
}

type PokedexContextValue = {
  collection: Pokemon[]
  history: HistoryEntry[]
  isStoreLoading: boolean
  toast: ToastMessage | null
  catchPokemon: (pokemon: Pokemon) => Promise<boolean>
  releasePokemon: (pokemon: Pokemon) => Promise<void>
  showToast: (toast: Omit<ToastMessage, "id">) => void
  clearToast: () => void
}

const PokedexContext = createContext<PokedexContextValue | null>(null)
const COLLECTION_KEY = "pokedex-collection-v1"
const HISTORY_KEY = "pokedex-history-v1"

const makeEntry = (
  pokemon: Pokemon,
  action: HistoryEntry["action"],
  agoMinutes = 0,
): HistoryEntry => ({
  id: `${action}-${pokemon.id}-${Date.now()}-${Math.random()}`,
  pokemon,
  action,
  timestamp: new Date(Date.now() - agoMinutes * 60_000).toISOString(),
})

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export function PokedexProvider({ children }: { children: ReactNode }) {
  const starterCollection = [pokemonData[5], pokemonData[17], pokemonData[10]]
  const [collection, setCollection] = useState<Pokemon[]>(() =>
    readStorage(COLLECTION_KEY, starterCollection),
  )
  const [history, setHistory] = useState<HistoryEntry[]>(() =>
    readStorage(HISTORY_KEY, [
      makeEntry(starterCollection[2], "catch", 42),
      makeEntry(starterCollection[1], "catch", 1380),
      makeEntry(starterCollection[0], "catch", 4260),
    ]),
  )
  const [isStoreLoading, setIsStoreLoading] = useState(true)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsStoreLoading(false), 350)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(
    () =>
      window.localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection)),
    [collection],
  )
  useEffect(
    () => window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history)),
    [history],
  )
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 5000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const showToast = useCallback(
    (next: Omit<ToastMessage, "id">) => setToast({ ...next, id: Date.now() }),
    [],
  )
  const clearToast = useCallback(() => setToast(null), [])

  const catchPokemon = useCallback(
    async (pokemon: Pokemon) => {
      const success = await pokemonService.catchPokemon()
      if (success) {
        setCollection((current) =>
          current.some((item) => item.id === pokemon.id)
            ? current
            : [pokemon, ...current],
        )
        setHistory((current) => [makeEntry(pokemon, "catch"), ...current])
        showToast({
          tone: "success",
          message: `Gotcha! ${pokemon.name} was caught!`,
          action: { label: "View in My Pokémon", href: "/collection" },
        })
      }
      return success
    },
    [showToast],
  )

  const releasePokemon = useCallback(
    async (pokemon: Pokemon) => {
      await pokemonService.releasePokemon()
      setCollection((current) =>
        current.filter((item) => item.id !== pokemon.id),
      )
      setHistory((current) => [makeEntry(pokemon, "release"), ...current])
      showToast({
        tone: "success",
        message: `${pokemon.name} has been released.`,
      })
    },
    [showToast],
  )

  const value = useMemo(
    () => ({
      collection,
      history,
      isStoreLoading,
      toast,
      catchPokemon,
      releasePokemon,
      showToast,
      clearToast,
    }),
    [
      collection,
      history,
      isStoreLoading,
      toast,
      catchPokemon,
      releasePokemon,
      showToast,
      clearToast,
    ],
  )

  return (
    <PokedexContext.Provider value={value}>{children}</PokedexContext.Provider>
  )
}

export function usePokedex() {
  const context = useContext(PokedexContext)
  if (!context)
    throw new Error("usePokedex must be used within PokedexProvider")
  return context
}

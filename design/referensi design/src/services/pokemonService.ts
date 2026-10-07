import { pokemonData, type Pokemon } from "../data/pokemon"

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms))

export type HistoryAction = "catch" | "release"

export type HistoryEntry = {
  id: string
  pokemon: Pokemon
  action: HistoryAction
  timestamp: string
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

export const pokemonService = {
  async getAll(): Promise<Pokemon[]> {
    await wait(450)
    return clone(pokemonData)
  },

  async getById(id: number): Promise<Pokemon> {
    await wait(400)
    const pokemon = pokemonData.find((item) => item.id === id)
    if (!pokemon) throw new Error("We couldn't find that Pokémon.")
    return clone(pokemon)
  },

  async catchPokemon(): Promise<boolean> {
    await wait(1100)
    return Math.random() > 0.3
  },

  async releasePokemon(): Promise<void> {
    await wait(450)
    if (Math.random() < 0.04)
      throw new Error("Release failed. Please try again.")
  },
}

export type PokemonType = "bug" | "dragon" | "electric" | "fairy" | "fighting" | "fire" | "flying" | "ghost" | "grass" | "ground" | "ice" | "normal" | "poison" | "psychic" | "rock" | "steel" | "water"

export type Pokemon = {
  id: number
  name: string
  types: PokemonType[]
  height: number
  weight: number
  abilities: string[]
  stats: {
    hp: number
    attack: number
    defense: number
    specialAttack: number
    specialDefense: number
    speed: number
  }
}

const p = (
  id: number,
  name: string,
  types: PokemonType[],
  height: number,
  weight: number,
  abilities: string[],
  stats: Pokemon["stats"],
): Pokemon => ({ id, name, types, height, weight, abilities, stats })

export const pokemonData: Pokemon[] = [
  p(
    1,
    "Bulbasaur",
    ["grass", "poison"],
    0.7,
    6.9,
    ["Overgrow", "Chlorophyll"],
    {
      hp: 45,
      attack: 49,
      defense: 49,
      specialAttack: 65,
      specialDefense: 65,
      speed: 45,
    },
  ),
  p(4, "Charmander", ["fire"], 0.6, 8.5, ["Blaze", "Solar Power"], {
    hp: 39,
    attack: 52,
    defense: 43,
    specialAttack: 60,
    specialDefense: 50,
    speed: 65,
  }),
  p(7, "Squirtle", ["water"], 0.5, 9, ["Torrent", "Rain Dish"], {
    hp: 44,
    attack: 48,
    defense: 65,
    specialAttack: 50,
    specialDefense: 64,
    speed: 43,
  }),
  p(10, "Caterpie", ["bug"], 0.3, 2.9, ["Shield Dust", "Run Away"], {
    hp: 45,
    attack: 30,
    defense: 35,
    specialAttack: 20,
    specialDefense: 20,
    speed: 45,
  }),
  p(
    16,
    "Pidgey",
    ["normal", "flying"],
    0.3,
    1.8,
    ["Keen Eye", "Tangled Feet"],
    {
      hp: 40,
      attack: 45,
      defense: 40,
      specialAttack: 35,
      specialDefense: 35,
      speed: 56,
    },
  ),
  p(25, "Pikachu", ["electric"], 0.4, 6, ["Static", "Lightning Rod"], {
    hp: 35,
    attack: 55,
    defense: 40,
    specialAttack: 50,
    specialDefense: 50,
    speed: 90,
  }),
  p(27, "Sandshrew", ["ground"], 0.6, 12, ["Sand Veil", "Sand Rush"], {
    hp: 50,
    attack: 75,
    defense: 85,
    specialAttack: 20,
    specialDefense: 30,
    speed: 40,
  }),
  p(35, "Clefairy", ["fairy"], 0.6, 7.5, ["Cute Charm", "Magic Guard"], {
    hp: 70,
    attack: 45,
    defense: 48,
    specialAttack: 60,
    specialDefense: 65,
    speed: 35,
  }),
  p(
    39,
    "Jigglypuff",
    ["normal", "fairy"],
    0.5,
    5.5,
    ["Cute Charm", "Competitive"],
    {
      hp: 115,
      attack: 45,
      defense: 20,
      specialAttack: 45,
      specialDefense: 25,
      speed: 20,
    },
  ),
  p(52, "Meowth", ["normal"], 0.4, 4.2, ["Pickup", "Technician"], {
    hp: 40,
    attack: 45,
    defense: 35,
    specialAttack: 40,
    specialDefense: 40,
    speed: 90,
  }),
  p(54, "Psyduck", ["water"], 0.8, 19.6, ["Damp", "Cloud Nine"], {
    hp: 50,
    attack: 52,
    defense: 48,
    specialAttack: 65,
    specialDefense: 50,
    speed: 55,
  }),
  p(58, "Growlithe", ["fire"], 0.7, 19, ["Intimidate", "Flash Fire"], {
    hp: 55,
    attack: 70,
    defense: 45,
    specialAttack: 70,
    specialDefense: 50,
    speed: 60,
  }),
  p(63, "Abra", ["psychic"], 0.9, 19.5, ["Synchronize", "Magic Guard"], {
    hp: 25,
    attack: 20,
    defense: 15,
    specialAttack: 105,
    specialDefense: 55,
    speed: 90,
  }),
  p(66, "Machop", ["fighting"], 0.8, 19.5, ["Guts", "No Guard"], {
    hp: 70,
    attack: 80,
    defense: 50,
    specialAttack: 35,
    specialDefense: 35,
    speed: 35,
  }),
  p(74, "Geodude", ["rock", "ground"], 0.4, 20, ["Rock Head", "Sturdy"], {
    hp: 40,
    attack: 80,
    defense: 100,
    specialAttack: 30,
    specialDefense: 30,
    speed: 20,
  }),
  p(92, "Gastly", ["ghost", "poison"], 1.3, 0.1, ["Levitate"], {
    hp: 30,
    attack: 35,
    defense: 30,
    specialAttack: 100,
    specialDefense: 35,
    speed: 80,
  }),
  p(95, "Onix", ["rock", "ground"], 8.8, 210, ["Rock Head", "Sturdy"], {
    hp: 35,
    attack: 45,
    defense: 160,
    specialAttack: 30,
    specialDefense: 45,
    speed: 70,
  }),
  p(133, "Eevee", ["normal"], 0.3, 6.5, ["Run Away", "Adaptability"], {
    hp: 55,
    attack: 55,
    defense: 50,
    specialAttack: 45,
    specialDefense: 65,
    speed: 55,
  }),
  p(143, "Snorlax", ["normal"], 2.1, 460, ["Immunity", "Thick Fat"], {
    hp: 160,
    attack: 110,
    defense: 65,
    specialAttack: 65,
    specialDefense: 110,
    speed: 30,
  }),
  p(147, "Dratini", ["dragon"], 1.8, 3.3, ["Shed Skin", "Marvel Scale"], {
    hp: 41,
    attack: 64,
    defense: 45,
    specialAttack: 50,
    specialDefense: 50,
    speed: 50,
  }),
  p(152, "Chikorita", ["grass"], 0.9, 6.4, ["Overgrow", "Leaf Guard"], {
    hp: 45,
    attack: 49,
    defense: 65,
    specialAttack: 49,
    specialDefense: 65,
    speed: 45,
  }),
  p(155, "Cyndaquil", ["fire"], 0.5, 7.9, ["Blaze", "Flash Fire"], {
    hp: 39,
    attack: 52,
    defense: 43,
    specialAttack: 60,
    specialDefense: 50,
    speed: 65,
  }),
  p(158, "Totodile", ["water"], 0.6, 9.5, ["Torrent", "Sheer Force"], {
    hp: 50,
    attack: 65,
    defense: 64,
    specialAttack: 44,
    specialDefense: 48,
    speed: 43,
  }),
  p(175, "Togepi", ["fairy"], 0.3, 1.5, ["Hustle", "Serene Grace"], {
    hp: 35,
    attack: 20,
    defense: 65,
    specialAttack: 40,
    specialDefense: 65,
    speed: 20,
  }),
]

export const artworkUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

export const formatPokemonId = (id: number) => `#${String(id).padStart(3, "0")}`

/**
 * Base URL Backend API.
 *
 * Frontend tidak mengakses PokéAPI secara langsung.
 * Semua request Pokémon melewati Laravel Backend.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Mengambil daftar Pokémon dari Laravel Backend.
 *
 * Endpoint:
 * GET /api/pokemon
 *
 * Response Backend:
 * {
 *   count: 1351,
 *   next: "...",
 *   previous: null,
 *   results: [
 *     {
 *       id: 1,
 *       name: "bulbasaur",
 *       image: "https://..."
 *     }
 *   ]
 * }
 */
export async function getPokemonList({ signal } = {}) {
  const endpoint = `${API_BASE_URL}/api/pokemon?limit=20&offset=0`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(
        `Server backend merespons HTTP ${response.status}`
      );
    }

    const json = await response.json();

    return {
      data: Array.isArray(json?.results) ? json.results : [],
      count: json?.count ?? 0,
      next: json?.next ?? null,
      previous: json?.previous ?? null,
      error: null,
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    console.error(
      `[Pokédex API] Gagal mengambil daftar Pokémon: ${error.message}`
    );

    return {
      data: null,
      count: 0,
      next: null,
      previous: null,
      error:
        "Gagal memuat data Pokémon. Pastikan server Laravel sedang berjalan.",
    };
  }
}

/**
 * Mengambil hasil pencarian Pokémon dari Laravel Backend.
 *
 * Endpoint:
 * GET /api/pokemon?search={keyword}
 */
export async function searchPokemonFromApi(
  keyword,
  { signal } = {}
) {
  const normalizedKeyword = (keyword || "").trim();

  if (!normalizedKeyword) {
    return {
      data: null,
      count: 0,
      error: null,
    };
  }

  const endpoint =
    `${API_BASE_URL}/api/pokemon?search=` +
    encodeURIComponent(normalizedKeyword);

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(
        `Server backend merespons HTTP ${response.status}`
      );
    }

    const json = await response.json();

    return {
      data: Array.isArray(json?.results) ? json.results : [],
      count: json?.count ?? 0,
      error: null,
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    console.error(
      `[Pokédex Search] Gagal mencari Pokémon: ${error.message}`
    );

    return {
      data: null,
      count: 0,
      error:
        "Gagal melakukan pencarian. Pastikan server Laravel sedang berjalan.",
    };
  }
}

/**
 * Normalisasi data detail Pokémon.
 *
 * Backend Laravel sudah mengirim data dalam format
 * yang lebih sederhana dibandingkan response mentah PokéAPI.
 */
function normalizePokemonDetail(raw) {
  if (!raw) return null;

  const stats = {
    hp: 0,
    attack: 0,
    defense: 0,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0,
  };

  if (raw.stats && typeof raw.stats === "object") {
    stats.hp = raw.stats.hp ?? 0;
    stats.attack = raw.stats.attack ?? 0;
    stats.defense = raw.stats.defense ?? 0;

    stats.specialAttack =
      raw.stats.specialAttack ??
      raw.stats["special-attack"] ??
      0;

    stats.specialDefense =
      raw.stats.specialDefense ??
      raw.stats["special-defense"] ??
      0;

    stats.speed = raw.stats.speed ?? 0;
  }

  return {
    id: raw.id,
    name: raw.name,
    image: raw.image,
    types: Array.isArray(raw.types) ? raw.types : [],
    height: raw.height ?? 0,
    weight: raw.weight ?? 0,
    abilities: Array.isArray(raw.abilities)
      ? raw.abilities
      : [],
    stats,
  };
}

/**
 * Mengambil detail Pokémon berdasarkan ID atau nama.
 *
 * Endpoint:
 * GET /api/pokemon/{id}
 */
export async function getPokemonDetail(
  id,
  { signal } = {}
) {
  const endpoint =
    `${API_BASE_URL}/api/pokemon/` +
    encodeURIComponent(id);

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          data: null,
          error: "Pokémon tidak ditemukan.",
          isNotFound: true,
        };
      }

      throw new Error(
        `Server backend merespons HTTP ${response.status}`
      );
    }

    const json = await response.json();

    return {
      data: normalizePokemonDetail(json),
      error: null,
      isNotFound: false,
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    console.error(
      `[Pokédex API] Gagal mengambil detail Pokémon: ${error.message}`
    );

    return {
      data: null,
      error:
        "Gagal memuat detail Pokémon. Pastikan server Laravel sedang berjalan.",
      isNotFound: false,
    };
  }
}
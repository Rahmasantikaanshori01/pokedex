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
 * GET /api/pokemon?limit={limit}&offset={offset}
 */
export async function getPokemonList({
  limit = 20,
  offset = 0,
  signal,
} = {}) {
  const endpoint = `${API_BASE_URL}/api/pokemon?limit=${limit}&offset=${offset}`;

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

    const count = json?.count ?? 0;
    const hasMore =
      typeof json?.has_more === "boolean"
        ? json.has_more
        : offset + limit < count;

    return {
      data: Array.isArray(json?.results) ? json.results : [],
      count,
      has_more: hasMore,
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
      has_more: false,
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
  if (!raw) {
    return null;
  }

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

/**
 * Mencoba menangkap Pokémon.
 *
 * Endpoint:
 * POST /api/my-pokemon
 *
 * Backend akan menentukan apakah Pokémon berhasil
 * ditangkap atau melarikan diri.
 */
export async function catchPokemon(pokemon) {
  const endpoint = `${API_BASE_URL}/api/my-pokemon`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pokemon_id: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
        types: pokemon.types,
        height: pokemon.height,
        weight: pokemon.weight,
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        data: null,
        success: false,
        caught: false,
        message: "",
        error:
          json?.message || "Gagal menangkap Pokémon.",
      };
    }

    return {
      data: json?.data ?? null,
      success: json?.success ?? false,
      caught: json?.caught ?? false,
      message: json?.message ?? "",
      error: null,
    };
  } catch (error) {
    console.error(
      `[Pokédex API] Gagal menangkap Pokémon: ${error.message}`
    );

    return {
      data: null,
      success: false,
      caught: false,
      message: "",
      error:
        "Gagal menghubungi server. Pastikan Laravel sedang berjalan.",
    };
  }
}

/**
 * Mengambil Pokémon yang sudah ditangkap.
 *
 * Endpoint:
 * GET /api/my-pokemon
 */
export async function getMyPokemon({ signal } = {}) {
  const endpoint = `${API_BASE_URL}/api/my-pokemon`;

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
      data: Array.isArray(json?.data) ? json.data : [],
      count: json?.count ?? 0,
      error: null,
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    console.error(
      `[Pokédex Collection] Gagal mengambil koleksi: ${error.message}`
    );

    return {
      data: null,
      count: 0,
      error:
        "Gagal memuat koleksi Pokémon. Pastikan server Laravel sedang berjalan.",
    };
  }
}

/**
 * Melepaskan Pokémon dari koleksi.
 *
 * Endpoint:
 * DELETE /api/my-pokemon/{id}
 *
 * ID yang digunakan adalah ID database
 * dari tabel my_pokemon.
 */
export async function releasePokemon(
  id,
  { signal } = {}
) {
  const endpoint =
    `${API_BASE_URL}/api/my-pokemon/` +
    encodeURIComponent(id);

  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
      signal,
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message:
          json?.message ||
          "Gagal melepaskan Pokémon.",
        error:
          json?.message ||
          "Gagal melepaskan Pokémon.",
      };
    }

    return {
      success: true,
      message:
        json?.message ||
        "Pokémon berhasil dilepaskan dari koleksi.",
      error: null,
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    console.error(
      `[Pokédex Collection] Gagal release Pokémon: ${error.message}`
    );

    return {
      success: false,
      message:
        "Tidak dapat terhubung ke server Laravel.",
      error:
        "Tidak dapat terhubung ke server Laravel.",
    };
  }
}
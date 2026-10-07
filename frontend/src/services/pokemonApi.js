import { mockPokemonList } from "../mock/pokemonMockData";

/**
 * Konfigurasi Base URL Backend API.
 * Menggunakan environment variable NEXT_PUBLIC_API_URL jika tersedia,
 * dengan fallback default ke http://localhost:8000.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Mengambil daftar seluruh Pokémon dari Backend API.
 *
 * Kontrak API Backend:
 * GET /api/pokemon
 *
 * Contoh response yang diharapkan:
 * {
 *   "data": [
 *     {
 *       "id": 1,
 *       "name": "bulbasaur",
 *       "image": "https://..."
 *     },
 *     {
 *       "id": 2,
 *       "name": "ivysaur",
 *       "image": "https://..."
 *     }
 *   ]
 * }
 *
 * @param {object} options - Opsi tambahan seperti AbortSignal
 * @returns {Promise<{ data: Array|null, error: string|null }>}
 */
export async function getPokemonList({ signal } = {}) {
  const endpoint = `${API_BASE_URL}/api/pokemon`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`Server backend merespons HTTP ${response.status}`);
    }

    const json = await response.json();

    // Normalisasi struktur data jika backend mengirim { data: [...] } atau array langsung [...]
    const results = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
        ? json.data
        : [];

    return {
      data: results,
      error: null,
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    /*
     * Catatan Penanganan Error:
     * Jika server backend belum berjalan atau route GET /api/pokemon belum dibuat di backend Laravel,
     * tangkap error dan sampaikan pesan yang informatif ke UI tanpa menyebabkan uncaught rejection.
     */
    console.warn(
      `[Pokédex API] Gagal mengambil daftar Pokémon dari ${endpoint}: ${error.message}`
    );

    return {
      data: null,
      error:
        "Gagal memuat data Pokémon. Server backend belum tersedia atau tidak dapat dihubungi.",
    };
  }
}

/**
 * Normalisasi data detail Pokémon agar sesuai dengan kebutuhan UI.
 */
function normalizePokemonDetail(raw) {
  if (!raw) return null;
  const p = raw.data || raw;

  // Normalisasi abilities
  let abilities = [];
  if (Array.isArray(p.abilities)) {
    abilities = p.abilities.map((a) => {
      if (typeof a === "string") return a;
      if (a?.ability?.name) return a.ability.name;
      if (a?.name) return a.name;
      return String(a);
    });
  }

  // Normalisasi types
  let types = [];
  if (Array.isArray(p.types)) {
    types = p.types.map((t) => {
      if (typeof t === "string") return t;
      if (t?.type?.name) return t.type.name;
      if (t?.name) return t.name;
      return String(t);
    });
  }
  if (types.length === 0) types = ["normal"];

  // Normalisasi stats
  const stats = {
    hp: 0,
    attack: 0,
    defense: 0,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0,
  };

  if (Array.isArray(p.stats)) {
    p.stats.forEach((s) => {
      const name = s?.stat?.name || s?.name;
      const val = s?.base_stat ?? s?.value ?? 0;
      if (name === "hp") stats.hp = val;
      else if (name === "attack") stats.attack = val;
      else if (name === "defense") stats.defense = val;
      else if (name === "special-attack" || name === "specialAttack")
        stats.specialAttack = val;
      else if (name === "special-defense" || name === "specialDefense")
        stats.specialDefense = val;
      else if (name === "speed") stats.speed = val;
    });
  } else if (p.stats && typeof p.stats === "object") {
    stats.hp = p.stats.hp ?? 0;
    stats.attack = p.stats.attack ?? 0;
    stats.defense = p.stats.defense ?? 0;
    stats.specialAttack =
      p.stats.specialAttack ?? p.stats["special-attack"] ?? p.stats.spAttack ?? 0;
    stats.specialDefense =
      p.stats.specialDefense ??
      p.stats["special-defense"] ??
      p.stats.spDefense ??
      0;
    stats.speed = p.stats.speed ?? 0;
  }

  return {
    id: p.id,
    name: p.name,
    image: p.image,
    types,
    height: p.height ?? 0,
    weight: p.weight ?? 0,
    abilities,
    stats,
  };
}

/**
 * Mengambil detail Pokémon berdasarkan ID dari Backend API.
 *
 * Kontrak API Backend:
 * GET /api/pokemon/{id}
 *
 * Contoh request:
 * GET /api/pokemon/25
 *
 * @param {string|number} id - ID Pokémon
 * @param {object} options - Opsi tambahan seperti AbortSignal
 * @returns {Promise<{ data: object|null, error: string|null }>}
 */
export async function getPokemonDetail(id, { signal } = {}) {
  const endpoint = `${API_BASE_URL}/api/pokemon/${encodeURIComponent(id)}`;

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
      throw new Error(`Server backend merespons HTTP ${response.status}`);
    }

    const json = await response.json();
    const normalized = normalizePokemonDetail(json);

    return {
      data: normalized,
      error: null,
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    console.warn(
      `[Pokédex API] Gagal mengambil detail Pokémon dari ${endpoint}: ${error.message}`
    );

    return {
      data: null,
      error:
        "Gagal memuat detail Pokémon. Server backend belum tersedia atau tidak dapat dihubungi.",
    };
  }
}

/**
 * Mengambil daftar Pokémon berdasarkan keyword pencarian dari Backend API.
 *
 * Kontrak API Backend:
 * GET /api/pokemon?search={keyword}
 *
 * Contoh request:
 * GET /api/pokemon?search=pikachu
 *
 * @param {string} keyword - Nama Pokémon yang dicari
 * @param {object} options - Opsi tambahan seperti AbortSignal
 * @returns {Promise<{ data: Array, error: string|null, source: 'api'|'fallback' }>}
 */
export async function searchPokemonFromApi(keyword, { signal } = {}) {
  const normalizedKeyword = (keyword || "").trim().toLowerCase();

  // Jika keyword kosong, jangan lakukan request
  if (!normalizedKeyword) {
    return { data: null, error: null, source: "none" };
  }

  // Menggunakan URL encoding yang benar untuk keyword
  const endpoint = `${API_BASE_URL}/api/pokemon?search=${encodeURIComponent(
    normalizedKeyword
  )}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const json = await response.json();

    const results = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
        ? json.data
        : [];

    return {
      data: results,
      error: null,
      source: "api",
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    console.warn(
      `[Pokédex Search] Request ke backend API (${endpoint}) belum dapat terhubung: ${error.message}. ` +
      `Menggunakan fallback lokal sementara untuk pengujian frontend.`
    );

    const fallbackResults = mockPokemonList.filter((poke) =>
      poke.name.toLowerCase().includes(normalizedKeyword)
    );

    return {
      data: fallbackResults,
      error: null,
      source: "fallback",
    };
  }
}

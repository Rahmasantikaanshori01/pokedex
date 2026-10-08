const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getHistory({ signal } = {}) {
  const endpoint = `${API_BASE_URL}/api/history`;

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
      `[Pokédex History] Gagal mengambil history: ${error.message}`
    );

    return {
      data: null,
      count: 0,
      error:
        "Gagal memuat riwayat. Pastikan server Laravel sedang berjalan.",
    };
  }
}
"use client";

import { useEffect, useState } from "react";
import { getHistory } from "@/services/historyApi.js";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const result = await getHistory();

        const data = Array.isArray(result.data) ? result.data : [];

        // Ambil hanya aktivitas terakhir dari setiap Pokemon
        const latestHistory = data.reduce((acc, item) => {
          if (!acc[item.pokemon_id]) {
            acc[item.pokemon_id] = item;
          }

          return acc;
        }, {});

        setHistory(Object.values(latestHistory));
        setError(result.error);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Gagal memuat history.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500">
            POKEDEX
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            History
          </h1>

          <p className="mt-2 text-gray-500">
            Riwayat aktivitas Pokemon kamu.
          </p>
        </div>

        {loading && (
          <div className="flex min-h-[400px] items-center justify-center rounded-3xl bg-white shadow-sm">
            <p className="text-gray-500">
              Memuat history...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="flex min-h-[400px] items-center justify-center rounded-3xl bg-white shadow-sm">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-500">
                Gagal memuat history
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {error}
              </p>
            </div>
          </div>
        )}

        {!loading && !error && history.length === 0 && (
          <div className="flex min-h-[400px] items-center justify-center rounded-3xl bg-white shadow-sm">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-500">
                History
              </div>

              <h2 className="text-xl font-semibold text-gray-900">
                Belum ada history
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Pokemon yang kamu lihat akan muncul di sini.
              </p>
            </div>
          </div>
        )}

        {!loading && !error && history.length > 0 && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
            {history.map((pokemon) => (
              <div
                key={pokemon.pokemon_id}
                className="rounded-3xl bg-white p-5 shadow-sm"
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemon_id}.png`}
                  alt={pokemon.pokemon_name}
                  className="mx-auto h-32 w-32 object-contain"
                />

                <h2 className="mt-3 text-center text-lg font-semibold capitalize text-gray-900">
                  {pokemon.pokemon_name}
                </h2>

                <p className="mt-1 text-center text-sm capitalize text-gray-500">
                  {pokemon.activity}
                </p>

                <p className="mt-1 text-center text-xs text-gray-400">
                  #{String(pokemon.pokemon_id).padStart(3, "0")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
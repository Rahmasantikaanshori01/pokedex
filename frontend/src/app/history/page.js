"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import Navbar from "../../components/Navbar";
import ErrorState from "../../components/ErrorState";
import { PokeballIcon } from "../../components/Icons";
import { getHistory } from "../../services/historyApi";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHistory = useCallback(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    getHistory({
      signal: controller.signal,
    })
      .then((result) => {
        if (result.error) {
          setError(result.error);
          setHistory([]);
          return;
        }

        const data = Array.isArray(result.data)
          ? result.data
          : [];

        // Ambil aktivitas terakhir dari setiap Pokémon
        const latestHistory = data.reduce((acc, item) => {
          if (!acc[item.pokemon_id]) {
            acc[item.pokemon_id] = item;
          }

          return acc;
        }, {});

        setHistory(Object.values(latestHistory));
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(
            "Gagal memuat riwayat Pokémon. Silakan coba lagi."
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const cleanup = loadHistory();

    return cleanup;
  }, [loadHistory]);

  return (
    <div className="app-shell">
      {/* NAVBAR SAMA DENGAN MY POKÉMON */}
      <Navbar activeTab="History" />

      <main className="page content-section history-page">

        {/* ================= HEADER ================= */}
        <section className="history-header">
          <div>
            <span className="eyebrow">
              Your activity
            </span>

            <h1>History</h1>

            <p>
              Riwayat aktivitas Pokémon kamu.
            </p>
          </div>

          {!isLoading && !error && (
            <div className="history-count">
              <PokeballIcon />

              <span>{history.length}</span>

              <small>Pokémon</small>
            </div>
          )}
        </section>

        {/* ================= LOADING ================= */}
        {isLoading && (
          <section className="history-grid">
            <div className="history-card history-skeleton" />
            <div className="history-card history-skeleton" />
            <div className="history-card history-skeleton" />
          </section>
        )}

        {/* ================= ERROR ================= */}
        {!isLoading && error && (
          <ErrorState
            title="History Tidak Tersedia"
            message={error}
            onRetry={loadHistory}
            retryLabel="Coba lagi"
          />
        )}

        {/* ================= EMPTY ================= */}
        {!isLoading &&
          !error &&
          history.length === 0 && (
            <section className="collection-empty">
              <div className="collection-empty-icon">
                <PokeballIcon />
              </div>

              <h2>Belum Ada History</h2>

              <p>
                Aktivitas Catch dan Release Pokémon
                kamu akan muncul di sini.
              </p>

              <Link
                href="/"
                className="collection-empty-button"
              >
                Explore Pokémon
              </Link>
            </section>
          )}

        {/* ================= HISTORY CARDS ================= */}
        {!isLoading &&
          !error &&
          history.length > 0 && (
            <section className="history-grid">
              {history.map((item) => {
                const displayName = item.pokemon_name
                  ? item.pokemon_name
                    .charAt(0)
                    .toUpperCase() +
                  item.pokemon_name.slice(1)
                  : "Unknown";

                const isCatch =
                  item.activity === "catch";

                const activityLabel = isCatch
                  ? "Catch"
                  : "Release";

                return (
                  <article
                    className="history-card"
                    key={item.pokemon_id}
                  >
                    {/* Pokémon Image */}
                    <Link
                      href={`/pokemon/${item.pokemon_id}`}
                      className="history-card-image"
                    >
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.pokemon_id}.png`}
                        alt={`${displayName} official artwork`}
                        width={160}
                        height={160}
                      />
                    </Link>

                    {/* Pokémon Name */}
                    <Link
                      href={`/pokemon/${item.pokemon_id}`}
                      className="history-card-name"
                    >
                      {displayName}
                    </Link>

                    {/* Activity */}
                    <span
                      className={`history-card-activity ${isCatch
                          ? "is-catch"
                          : "is-release"
                        }`}
                    >
                      {activityLabel}
                    </span>

                    {/* Pokémon ID */}
                    <span className="history-card-id">
                      #
                      {String(item.pokemon_id).padStart(
                        3,
                        "0"
                      )}
                    </span>
                  </article>
                );
              })}
            </section>
          )}
      </main>

      {/* FOOTER SAMA DENGAN MY POKÉMON */}
      <footer>
        <PokeballIcon />

        <span>Pokédex Project</span>

        <small>
          Discover. Catch. Remember.
        </small>
      </footer>

      {/* ================= HISTORY CARD STYLE ================= */}
      <style jsx>{`
        .history-page {
          position: relative;
        }

        .history-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 32px;
          margin-bottom: 36px;
        }

        .history-count {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 118px;
          padding: 12px 17px;
          border: 1px solid #dce3e6;
          border-radius: 14px;
          background: #ffffff;
          color: #142b4a;
        }

        .history-count svg {
          width: 20px;
          height: 20px;
        }

        .history-count span {
          font-size: 14px;
          font-weight: 800;
        }

        .history-count small {
          font-size: 11px;
          color: #718096;
        }

        /*
         * HISTORY CARD
         * Berbeda dari card My Pokémon.
         * Dibuat lebih compact dan fokus ke:
         * gambar → nama → aktivitas → ID
         */
        .history-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fill,
            minmax(190px, 1fr)
          );
          gap: 20px;
        }

        .history-card {
          min-height: 270px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 20px 20px;
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          background: #ffffff;
          box-shadow:
            0 2px 5px rgba(20, 43, 74, 0.04),
            0 8px 20px rgba(20, 43, 74, 0.04);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .history-card:hover {
          transform: translateY(-3px);
          border-color: #d4dce1;
          box-shadow:
            0 5px 10px rgba(20, 43, 74, 0.06),
            0 14px 28px rgba(20, 43, 74, 0.07);
        }

        .history-card-image {
          width: 100%;
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          border-radius: 16px;
          background: #f5f8f7;
          transition: transform 0.2s ease;
        }

        .history-card-image:hover {
          transform: scale(1.02);
        }

        .history-card-image img {
          width: 140px;
          height: 140px;
          object-fit: contain;
          image-rendering: auto;
        }

        .history-card-name {
          margin-top: 16px;
          color: #142b4a;
          font-size: 17px;
          font-weight: 800;
          line-height: 1.2;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .history-card-name:hover {
          color: #e53935;
        }

        .history-card-activity {
          margin-top: 7px;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          line-height: 1;
        }

        .history-card-activity.is-catch {
          color: #28753b;
          background: #e7f5e9;
        }

        .history-card-activity.is-release {
          color: #a14c4c;
          background: #f9e9e9;
        }

        .history-card-id {
          margin-top: 7px;
          color: #9aa5b1;
          font-size: 11px;
          font-weight: 600;
        }

        .history-skeleton {
          min-height: 270px;
          background:
            linear-gradient(
              90deg,
              #ffffff 25%,
              #f3f5f5 50%,
              #ffffff 75%
            );
          background-size: 200% 100%;
          animation: history-loading 1.4s infinite;
        }

        @keyframes history-loading {
          from {
            background-position: 200% 0;
          }

          to {
            background-position: -200% 0;
          }
        }

        @media (max-width: 700px) {
          .history-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .history-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .history-card {
            min-height: 245px;
            padding: 18px 14px;
          }

          .history-card-image {
            height: 130px;
          }

          .history-card-image img {
            width: 115px;
            height: 115px;
          }

          .history-card-name {
            font-size: 15px;
          }
        }

        @media (max-width: 420px) {
          .history-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
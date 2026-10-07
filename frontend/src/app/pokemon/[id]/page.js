"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import PokemonTypeBadge from "../../../components/PokemonTypeBadge";
import StatBar from "../../../components/StatBar";
import ErrorState from "../../../components/ErrorState";
import {
  ArrowLeftIcon,
  PokeballIcon,
} from "../../../components/Icons";
import {
  getPokemonDetail,
  catchPokemon,
} from "../../../services/pokemonApi";
import {
  artworkUrl,
  formatPokemonId,
} from "../../../mock/pokemonMockData";

export default function PokemonDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [pokemon, setPokemon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCatching, setIsCatching] = useState(false);
  const [catchMessage, setCatchMessage] = useState("");
  const [catchStatus, setCatchStatus] = useState(null);

  /**
   * Memuat detail Pokémon dari Laravel Backend.
   *
   * GET /api/pokemon/{id}
   */
  const loadDetail = useCallback(() => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    const controller = new AbortController();

    getPokemonDetail(id, {
      signal: controller.signal,
    })
      .then((res) => {
        if (res.error) {
          setError(res.error);
          setPokemon(null);
        } else {
          setPokemon(res.data);
          setError(null);
        }

        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(
            "Gagal memuat detail Pokémon. Silakan coba lagi."
          );

          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    const cleanup = loadDetail();

    return cleanup;
  }, [loadDetail]);

  /**
   * Menangkap Pokémon melalui Laravel Backend.
   *
   * POST /api/my-pokemon
   */
  const handleCatch = async () => {
    if (!pokemon || isCatching) return;

    setIsCatching(true);
    setCatchMessage("");
    setCatchStatus(null);

    const result = await catchPokemon(pokemon);

    setIsCatching(false);

    if (result.success && result.caught) {
      setCatchStatus("success");
      setCatchMessage(
        result.message ||
        "Pokémon berhasil ditangkap!"
      );

      return;
    }

    setCatchStatus("error");
    setCatchMessage(
      result.error ||
      result.message ||
      "Pokémon berhasil melarikan diri!"
    );
  };

  const primaryType =
    pokemon?.types?.[0] || "normal";

  const formattedId = pokemon?.id
    ? formatPokemonId(pokemon.id)
    : "";

  const imageUrl =
    pokemon?.image ||
    (pokemon?.id
      ? artworkUrl(pokemon.id)
      : "");

  const displayName = pokemon?.name
    ? pokemon.name.charAt(0).toUpperCase() +
    pokemon.name.slice(1)
    : "";

  /**
   * Data statistik Pokémon.
   */
  const statEntries = pokemon?.stats
    ? [
      {
        label: "HP",
        value: pokemon.stats.hp,
      },
      {
        label: "Attack",
        value: pokemon.stats.attack,
      },
      {
        label: "Defense",
        value: pokemon.stats.defense,
      },
      {
        label: "Sp. Attack",
        value: pokemon.stats.specialAttack,
      },
      {
        label: "Sp. Defense",
        value: pokemon.stats.specialDefense,
      },
      {
        label: "Speed",
        value: pokemon.stats.speed,
      },
    ]
    : [];

  return (
    <div className="app-shell">
      {/* Header / Navbar */}
      <Navbar activeTab="Home" />

      <main className="page content-section detail-page">
        {/* Tombol kembali */}
        <Link
          href="/"
          className="back-link"
          aria-label="Kembali ke daftar Pokémon"
        >
          <ArrowLeftIcon />
          Back to Pokédex
        </Link>

        {/* Loading State */}
        {isLoading && (
          <div
            className="detail-skeleton"
            aria-label="Memuat detail Pokémon"
          >
            <div className="skeleton" />

            <div>
              <div className="skeleton" />
              <div className="skeleton" />
              <div className="skeleton" />
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <ErrorState
            title="Detail Pokémon Tidak Tersedia"
            message={error}
            onRetry={loadDetail}
            retryLabel="Coba lagi"
          />
        )}

        {/* Detail Pokémon */}
        {!isLoading &&
          !error &&
          pokemon && (
            <div className="detail-layout">
              {/* Visual Panel */}
              <section
                className={`detail-visual type-bg-${primaryType}`}
                aria-label={`Artwork ${displayName}`}
              >
                <span className="detail-number">
                  {formattedId}
                </span>

                <div
                  className="visual-ring"
                  aria-hidden="true"
                />

                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={`${displayName} official artwork`}
                    width={340}
                    height={340}
                    priority="true"
                  />
                )}

                <div
                  className="detail-dots"
                  aria-hidden="true"
                >
                  •••
                </div>
              </section>

              {/* Information Panel */}
              <section className="detail-info">
                <span className="eyebrow">
                  Pokémon profile
                </span>

                <div className="detail-title">
                  <h1>{displayName}</h1>

                  <span>
                    {formattedId}
                  </span>
                </div>

                {/* Pokémon Type */}
                <div className="type-row">
                  {pokemon.types?.map((type) => (
                    <PokemonTypeBadge
                      type={type}
                      key={type}
                    />
                  ))}
                </div>

                {/* Catch Section */}
                <div className="catch-section">
                  <button
                    type="button"
                    className="catch-button"
                    onClick={handleCatch}
                    disabled={isCatching}
                  >
                    <PokeballIcon />

                    <span>
                      {isCatching
                        ? "Mencoba menangkap..."
                        : "Catch Pokémon"}
                    </span>
                  </button>

                  {catchMessage && (
                    <p
                      className={`catch-message ${catchStatus === "success"
                          ? "catch-success"
                          : "catch-error"
                        }`}
                      role="status"
                    >
                      {catchMessage}
                    </p>
                  )}
                </div>

                {/* Height & Weight */}
                <div className="measure-grid">
                  <div>
                    <span>Height</span>

                    <strong>
                      {pokemon.height} m
                    </strong>
                  </div>

                  <div>
                    <span>Weight</span>

                    <strong>
                      {pokemon.weight} kg
                    </strong>
                  </div>
                </div>

                {/* Abilities */}
                <div className="info-block">
                  <h2>Abilities</h2>

                  <div className="ability-row">
                    {pokemon.abilities &&
                      pokemon.abilities.length > 0 ? (
                      pokemon.abilities.map(
                        (ability) => (
                          <span key={ability}>
                            {ability}
                          </span>
                        )
                      )
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </div>

                {/* Base Stats */}
                <div className="info-block">
                  <h2>Base stats</h2>

                  <div className="stats-list">
                    {statEntries.map(
                      ({ label, value }) => (
                        <StatBar
                          key={label}
                          label={label}
                          value={value}
                        />
                      )
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}
      </main>

      {/* Footer */}
      <footer>
        <PokeballIcon />

        <span>Pokédex Project</span>

        <small>
          Discover. Catch. Remember.
        </small>
      </footer>
    </div>
  );
}
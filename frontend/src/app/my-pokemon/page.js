"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import Navbar from "../../components/Navbar";
import PokemonTypeBadge from "../../components/PokemonTypeBadge";
import ErrorState from "../../components/ErrorState";
import { PokeballIcon } from "../../components/Icons";
import {
  getMyPokemon,
  releasePokemon,
} from "../../services/pokemonApi";

export default function MyPokemonPage() {
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [releasingId, setReleasingId] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  const loadMyPokemon = useCallback(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    getMyPokemon({
      signal: controller.signal,
    })
      .then((result) => {
        if (result.error) {
          setError(result.error);
          setPokemonList([]);
          return;
        }

        setPokemonList(result.data || []);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(
            "Gagal memuat koleksi Pokémon. Silakan coba lagi."
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
    const cleanup = loadMyPokemon();

    return cleanup;
  }, [loadMyPokemon]);

  const handleRelease = async (pokemon) => {
    const displayName = pokemon.name
      ? pokemon.name.charAt(0).toUpperCase() +
        pokemon.name.slice(1)
      : "Pokémon";

    const confirmed = window.confirm(
      `Apakah kamu yakin ingin melepaskan ${displayName} dari koleksi?`
    );

    if (!confirmed) {
      return;
    }

    setReleasingId(pokemon.id);
    setActionMessage(null);

    const result = await releasePokemon(pokemon.id);

    if (result.success) {
      setPokemonList((currentList) =>
        currentList.filter(
          (item) => item.id !== pokemon.id
        )
      );

      setActionMessage({
        type: "success",
        text:
          result.message ||
          `${displayName} berhasil dilepaskan.`,
      });
    } else {
      setActionMessage({
        type: "error",
        text:
          result.message ||
          "Gagal melepaskan Pokémon.",
      });
    }

    setReleasingId(null);
  };

  return (
    <div className="app-shell">
      <Navbar activeTab="My Pokémon" />

      <main className="page content-section collection-page">
        {/* Header */}
        <section className="collection-header">
          <div>
            <span className="eyebrow">
              Your collection
            </span>

            <h1>My Pokémon</h1>

            <p>
              Pokémon yang berhasil kamu tangkap akan
              tersimpan di sini.
            </p>
          </div>

          {!isLoading && !error && (
            <div className="collection-count">
              <PokeballIcon />

              <span>{pokemonList.length}</span>

              <small>Pokémon</small>
            </div>
          )}
        </section>

        {/* Action Message */}
        {actionMessage && (
          <div
            className={`collection-action-message ${
              actionMessage.type === "success"
                ? "is-success"
                : "is-error"
            }`}
          >
            {actionMessage.text}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="collection-loading">
            <div className="collection-loading-card" />
            <div className="collection-loading-card" />
            <div className="collection-loading-card" />
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <ErrorState
            title="Koleksi Tidak Tersedia"
            message={error}
            onRetry={loadMyPokemon}
            retryLabel="Coba lagi"
          />
        )}

        {/* Empty */}
        {!isLoading &&
          !error &&
          pokemonList.length === 0 && (
            <section className="collection-empty">
              <div className="collection-empty-icon">
                <PokeballIcon />
              </div>

              <h2>Belum Ada Pokémon</h2>

              <p>
                Kamu belum menangkap Pokémon apa pun.
                Jelajahi Pokédex dan coba tangkap
                Pokémon pertamamu.
              </p>

              <Link
                href="/"
                className="collection-empty-button"
              >
                Explore Pokémon
              </Link>
            </section>
          )}

        {/* Collection */}
        {!isLoading &&
          !error &&
          pokemonList.length > 0 && (
            <section className="collection-grid">
              {pokemonList.map((pokemon) => {
                const displayName = pokemon.name
                  ? pokemon.name.charAt(0).toUpperCase() +
                    pokemon.name.slice(1)
                  : "Unknown";

                const height =
                  Number(pokemon.height || 0) / 10;

                const weight =
                  Number(pokemon.weight || 0) / 10;

                const isReleasing =
                  releasingId === pokemon.id;

                return (
                  <article
                    className="collection-card"
                    key={pokemon.id}
                  >
                    {/* Image */}
                    <Link
                      href={`/pokemon/${pokemon.pokemon_id}`}
                      className="collection-card-image"
                    >
                      <span className="collection-card-number">
                        #
                        {String(
                          pokemon.pokemon_id
                        ).padStart(4, "0")}
                      </span>

                      <img
                        src={pokemon.image}
                        alt={`${displayName} official artwork`}
                        width={230}
                        height={230}
                      />
                    </Link>

                    {/* Information */}
                    <div className="collection-card-info">
                      <div className="collection-card-title">
                        <div>
                          <span className="collection-card-label">
                            Pokémon
                          </span>

                          <h2>{displayName}</h2>
                        </div>

                        <span className="collection-card-id">
                          #
                          {String(
                            pokemon.pokemon_id
                          ).padStart(4, "0")}
                        </span>
                      </div>

                      {/* Types */}
                      <div className="collection-card-types">
                        {Array.isArray(
                          pokemon.types
                        ) &&
                        pokemon.types.length > 0 ? (
                          pokemon.types.map(
                            (type) => (
                              <PokemonTypeBadge
                                key={type}
                                type={type}
                              />
                            )
                          )
                        ) : (
                          <span>-</span>
                        )}
                      </div>

                      {/* Height / Weight */}
                      <div className="collection-card-meta">
                        <div>
                          <span>Height</span>

                          <strong>
                            {height} m
                          </strong>
                        </div>

                        <div>
                          <span>Weight</span>

                          <strong>
                            {weight} kg
                          </strong>
                        </div>
                      </div>

                      {/* Detail */}
                      <Link
                        href={`/pokemon/${pokemon.pokemon_id}`}
                        className="collection-detail-button"
                      >
                        View Details
                      </Link>

                      {/* Release */}
                      <button
                        type="button"
                        className="collection-release-button"
                        disabled={isReleasing}
                        onClick={() =>
                          handleRelease(pokemon)
                        }
                      >
                        {isReleasing
                          ? "Releasing..."
                          : "Release Pokémon"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
      </main>

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
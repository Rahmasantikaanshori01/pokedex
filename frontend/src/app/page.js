"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import PokemonCard from "../components/PokemonCard";
import CardGridSkeleton from "../components/CardGridSkeleton";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import PageIntro from "../components/PageIntro";
import SearchBar from "../components/SearchBar";
import { PokeballIcon } from "../components/Icons";
import {
  getPokemonList,
  searchPokemonFromApi,
} from "../services/pokemonApi";
import { useDebounce } from "../hooks/useDebounce";
import {
  artworkUrl,
  featuredPokemon,
  formatPokemonId,
} from "../mock/pokemonMockData";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Home");

  // Data Pokémon dari Laravel API
  const [pokemonList, setPokemonList] = useState([]);

  // Status loading dan error
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Input pencarian
  const [searchQuery, setSearchQuery] = useState("");

  // Search yang sudah melalui debounce
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  /**
   * Mengambil daftar Pokémon awal dari Laravel.
   *
   * GET /api/pokemon
   */
  const fetchPokemon = useCallback(() => {
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();

    getPokemonList({
      signal: controller.signal,
    })
      .then((res) => {
        if (res.error) {
          setError(res.error);
          setPokemonList([]);
        } else {
          setPokemonList(res.data || []);
          setError(null);
        }

        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(
            "Gagal memuat data Pokémon. Silakan coba lagi."
          );
          setPokemonList([]);
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  /**
   * Mengambil daftar Pokémon pertama kali.
   */
  useEffect(() => {
    const cleanup = fetchPokemon();

    return cleanup;
  }, [fetchPokemon]);

  /**
   * Search Pokémon melalui Laravel API.
   *
   * GET /api/pokemon?search={keyword}
   */
  useEffect(() => {
    const keyword = debouncedSearchQuery.trim();

    // Jika input kosong, kembali ke daftar awal
    if (!keyword) {
      fetchPokemon();
      return;
    }

    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    searchPokemonFromApi(keyword, {
      signal: controller.signal,
    })
      .then((res) => {
        if (res.error) {
          setError(res.error);
          setPokemonList([]);
        } else {
          setPokemonList(res.data || []);
          setError(null);
        }

        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(
            "Gagal melakukan pencarian Pokémon. Silakan coba lagi."
          );
          setPokemonList([]);
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [debouncedSearchQuery, fetchPokemon]);

  const isSearching = Boolean(
    debouncedSearchQuery.trim()
  );

  return (
    <div className="app-shell">
      {/* 1. Header / Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      <main className="page">
        {/* 2. Hero Section */}
        <section className="home-hero">
          {/* Featured Cards Showcase */}
          <div className="featured-showcase">
            <div className="showcase-label">
              <span>Featured team</span>
              <strong>Choose your partner</strong>
            </div>

            <div
              className="featured-cards"
              aria-label="Featured Pokémon"
            >
              {featuredPokemon.map((item, index) => (
                <div
                  key={item.id}
                  className={`featured-card featured-card-${index + 1
                    }`}
                >
                  <span>{formatPokemonId(item.id)}</span>

                  <img
                    src={artworkUrl(item.id)}
                    alt={item.name}
                    width={165}
                    height={165}
                  />

                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.type}</small>
                  </div>
                </div>
              ))}
            </div>

            <span className="showcase-note">
              Swipe through the classics
            </span>
          </div>

          {/* Hero Copy */}
          <div className="hero-copy">
            <span className="eyebrow">
              <PokeballIcon /> Gotta find ’em all
            </span>

            <h1>
              <span>Find your</span>
              <span>favorite</span>
              <em>Pokémon</em>
            </h1>

            <p>
              Meet every Pokémon, learn what makes them
              special, and build a team that feels completely
              yours.
            </p>

            <div
              className="hero-mascot"
              aria-hidden="true"
            >
              <span>Hi, trainer!</span>

              <img
                src={artworkUrl(194)}
                alt="Wooper mascot"
                width={155}
                height={155}
              />
            </div>
          </div>

          {/* Corner Pikachu Artwork */}
          <div
            className="corner-pikachu"
            aria-hidden="true"
          >
            <img
              src={artworkUrl(25)}
              alt="Corner Pikachu"
              width={145}
              height={145}
            />
          </div>
        </section>

        {/* 3. Search Band */}
        <section className="home-search-band">
          <div>
            <span className="eyebrow">
              Who are you looking for?
            </span>

            <h2>Search the Pokédex</h2>
          </div>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
            placeholder="Cari Pokémon berdasarkan nama..."
            disabled={Boolean(error)}
          />
        </section>

        {/* 4. Main Pokédex Content Section */}
        <section className="content-section">
          <PageIntro
            eyebrow="Explore the Pokédex"
            title={
              isSearching
                ? `Hasil pencarian untuk “${searchQuery}”`
                : "Popular Pokémon"
            }
            side={
              !isLoading &&
              !error && (
                <span className="result-count">
                  {pokemonList.length} Pokémon
                </span>
              )
            }
          />

          {/* Loading */}
          {isLoading && (
            <CardGridSkeleton count={10} />
          )}

          {/* Error */}
          {!isLoading && error && (
            <ErrorState
              title="Gagal memuat data Pokémon"
              message={error}
              onRetry={
                isSearching
                  ? () =>
                    setSearchQuery(searchQuery)
                  : fetchPokemon
              }
              retryLabel="Coba lagi"
            />
          )}

          {/* Empty */}
          {!isLoading &&
            !error &&
            pokemonList.length === 0 && (
              <EmptyState
                title="Pokémon tidak ditemukan"
                message={
                  isSearching
                    ? `Tidak ada Pokémon yang cocok dengan nama “${searchQuery}”.`
                    : "Belum ada data Pokémon yang tersedia dari server backend."
                }
                actionLabel={
                  isSearching
                    ? "Hapus pencarian"
                    : undefined
                }
                onAction={
                  isSearching
                    ? () => setSearchQuery("")
                    : undefined
                }
              />
            )}

          {/* Pokémon List */}
          {!isLoading &&
            !error &&
            pokemonList.length > 0 && (
              <div className="pokemon-grid">
                {pokemonList.map((poke) => (
                  <PokemonCard
                    key={poke.id}
                    pokemon={poke}
                  />
                ))}
              </div>
            )}
        </section>
      </main>

      {/* 5. Footer */}
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
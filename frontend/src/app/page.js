"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Navbar from "../components/Navbar";
import PokemonCard from "../components/PokemonCard";
import CardGridSkeleton from "../components/CardGridSkeleton";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import PageIntro from "../components/PageIntro";
import SearchBar from "../components/SearchBar";
import { PokeballIcon } from "../components/Icons";
import { getPokemonList } from "../services/pokemonApi";
import {
  artworkUrl,
  featuredPokemon,
  formatPokemonId,
} from "../mock/pokemonMockData";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Home");

  // State untuk daftar Pokémon dari API backend
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State pencarian lokal di dalam daftar
  const [searchQuery, setSearchQuery] = useState("");

  // Fungsi untuk mengambil data Pokémon dari API Backend (GET /api/pokemon)
  const fetchPokemon = useCallback(() => {
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();

    getPokemonList({ signal: controller.signal })
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
          setError("Gagal memuat data Pokémon. Silakan coba lagi.");
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  // Ambil data dari API backend saat halaman pertama kali dimuat
  useEffect(() => {
    const cleanup = fetchPokemon();
    return cleanup;
  }, [fetchPokemon]);

  // Filter daftar Pokémon berdasarkan input pencarian
  const displayedPokemon = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) return pokemonList;
    return pokemonList.filter((poke) =>
      poke.name.toLowerCase().includes(trimmed)
    );
  }, [pokemonList, searchQuery]);

  return (
    <div className="app-shell">
      {/* 1. Header / Navbar */}
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      <main className="page">
        {/* 2. Hero Section */}
        <section className="home-hero">
          {/* Featured Cards Showcase */}
          <div className="featured-showcase">
            <div className="showcase-label">
              <span>Featured team</span>
              <strong>Choose your partner</strong>
            </div>

            <div className="featured-cards" aria-label="Featured Pokémon">
              {featuredPokemon.map((item, index) => (
                <div
                  key={item.id}
                  className={`featured-card featured-card-${index + 1}`}
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

            <span className="showcase-note">Swipe through the classics</span>
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
              Meet every Pokémon, learn what makes them special, and build a team
              that feels completely yours.
            </p>

            <div className="hero-mascot" aria-hidden="true">
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
          <div className="corner-pikachu" aria-hidden="true">
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
            <span className="eyebrow">Who are you looking for?</span>
            <h2>Search the Pokédex</h2>
          </div>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
            placeholder="Cari Pokémon berdasarkan nama..."
            disabled={isLoading || Boolean(error)}
          />
        </section>

        {/* 4. Main Pokédex Content Section */}
        <section className="content-section">
          {/* Header Intro */}
          <PageIntro
            eyebrow="Explore the Pokédex"
            title={
              searchQuery.trim()
                ? `Hasil pencarian untuk “${searchQuery}”`
                : "Popular Pokémon"
            }
            side={
              !isLoading &&
              !error && (
                <span className="result-count">
                  {displayedPokemon.length} Pokémon
                </span>
              )
            }
          />

          {/* Kondisi 1: Loading State saat data sedang dimuat dari backend */}
          {isLoading && <CardGridSkeleton count={10} />}

          {/* Kondisi 2: Error State jika request ke backend gagal */}
          {!isLoading && error && (
            <ErrorState
              title="Gagal memuat data Pokémon"
              message={error}
              onRetry={fetchPokemon}
              retryLabel="Coba lagi"
            />
          )}

          {/* Kondisi 3: Empty State jika data kosong */}
          {!isLoading && !error && displayedPokemon.length === 0 && (
            <EmptyState
              title="Pokémon tidak ditemukan"
              message={
                searchQuery.trim()
                  ? `Tidak ada Pokémon yang cocok dengan nama “${searchQuery}”.`
                  : "Belum ada data Pokémon yang tersedia dari server backend."
              }
              actionLabel={searchQuery.trim() ? "Hapus pencarian" : undefined}
              onAction={
                searchQuery.trim() ? () => setSearchQuery("") : undefined
              }
            />
          )}

          {/* Kondisi 4: Menampilkan Daftar Pokémon dari API Backend */}
          {!isLoading && !error && displayedPokemon.length > 0 && (
            <div className="pokemon-grid">
              {displayedPokemon.map((poke) => (
                <PokemonCard key={poke.id} pokemon={poke} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* 5. Footer */}
      <footer>
        <PokeballIcon />
        <span>Pokédex Project</span>
        <small>Discover. Catch. Remember.</small>
      </footer>
    </div>
  );
}

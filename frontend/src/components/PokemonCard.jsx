import Link from "next/link";
import PokemonTypeBadge from "./PokemonTypeBadge";
import { ArrowRightIcon } from "./Icons";
import { artworkUrl, formatPokemonId } from "../mock/pokemonMockData";

export default function PokemonCard({ pokemon, action }) {
  if (!pokemon) return null;

  const primaryType = pokemon.types?.[0] || "normal";
  const formattedId = formatPokemonId(pokemon.id);
  // Mendukung properti image dari response API backend atau fallback artwork PokeAPI
  const imageUrl = pokemon.image || artworkUrl(pokemon.id);
  const displayName = pokemon.name
    ? pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
    : "";

  return (
    <article className="pokemon-card">
      <Link
        href={`/pokemon/${pokemon.id}`}
        className="card-link"
        aria-label={`Lihat detail Pokémon ${displayName}`}
      >
        <span className="pokemon-id">{formattedId}</span>
        <div className={`pokemon-art type-bg-${primaryType}`}>
          <img
            src={imageUrl}
            alt={`${displayName} artwork`}
            loading="lazy"
            width={150}
            height={150}
          />
        </div>
        <div className="card-heading">
          <h2>{displayName}</h2>
          <ArrowRightIcon />
        </div>
        {pokemon.types && pokemon.types.length > 0 && (
          <div className="type-row">
            {pokemon.types.map((type) => (
              <PokemonTypeBadge type={type} key={type} />
            ))}
          </div>
        )}
      </Link>
      {action && <div className="card-action">{action}</div>}
    </article>
  );
}

export default function PokemonTypeBadge({ type }) {
  return <span className={`type-badge type-${type}`}>{type}</span>;
}

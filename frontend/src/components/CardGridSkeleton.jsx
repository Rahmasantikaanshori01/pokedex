export function SkeletonCard() {
  return (
    <div className="pokemon-card skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-id" />
      <div className="skeleton skeleton-art" />
      <div className="skeleton skeleton-name" />
      <div className="skeleton skeleton-badge" />
    </div>
  );
}

export function CardGridSkeleton({ count = 10 }) {
  return (
    <div className="pokemon-grid" aria-label="Loading Pokémon">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export default CardGridSkeleton;

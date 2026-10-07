import { EmptyPokeball } from "./Icons";

export default function EmptyState({
  title = "Pokémon tidak ditemukan",
  message = "Tidak ada Pokémon yang cocok dengan pencarianmu. Coba cari dengan nama Pokémon lain.",
  actionLabel = "Hapus pencarian",
  onAction,
}) {
  return (
    <section className="empty-state" aria-live="polite">
      <EmptyPokeball />
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {actionLabel && onAction && (
        <button
          type="button"
          className="button button-primary"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </section>
  );
}

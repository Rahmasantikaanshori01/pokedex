import { AlertIcon } from "./Icons";

export default function ErrorState({
  title = "Gagal memuat hasil pencarian",
  message = "Terjadi kendala saat menghubungi server. Silakan coba beberapa saat lagi.",
  onRetry,
  retryLabel = "Coba lagi",
}) {
  return (
    <section className="error-state" role="alert">
      <span>
        <AlertIcon />
      </span>
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {onRetry && (
        <div>
          <button
            type="button"
            className="button button-primary"
            onClick={onRetry}
          >
            {retryLabel}
          </button>
        </div>
      )}
    </section>
  );
}

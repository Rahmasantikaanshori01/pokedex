export default function StatBar({ label, value = 0 }) {
  // Skala visual persentase bar (max ~160)
  const percentage = Math.min(100, Math.max(0, (value / 160) * 100));

  return (
    <div className="stat-row">
      <span>{label}</span>
      <strong>{value}</strong>
      <div className="stat-track">
        <div
          className="stat-fill"
          style={{ width: `${percentage}%` }}
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={160}
          role="progressbar"
          aria-label={`${label}: ${value}`}
        />
      </div>
    </div>
  );
}

export default function Spinner({ label = "Loading…" }) {
  return (
    <div
      className="spin-loader"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="period" />
      <div className="period" />
      <div className="period" />
      <span className="load">{label}</span>
    </div>
  );
}

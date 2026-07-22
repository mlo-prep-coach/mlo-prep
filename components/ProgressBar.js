export default function ProgressBar({ value }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy-100">
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

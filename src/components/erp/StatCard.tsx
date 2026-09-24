export default function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-serif text-2xl font-medium">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

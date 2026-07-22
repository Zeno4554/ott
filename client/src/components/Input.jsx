export default function Input({ label, id, error, ...rest }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-bone-400">
        {label}
      </label>
      <input
        id={id}
        className={`rounded-md border bg-ink-900 px-3.5 py-2.5 text-bone-100 placeholder:text-bone-400/60
          transition-colors focus:border-marquee-gold focus:ring-1 focus:ring-marquee-gold
          ${error ? 'border-reel-crimson' : 'border-ink-600'}`}
        {...rest}
      />
      {error && <p className="text-sm text-reel-crimson">{error}</p>}
    </div>
  );
}

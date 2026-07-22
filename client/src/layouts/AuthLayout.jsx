export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-10">
      {/* Ambient vignette — quiet cinematic backdrop, no stock hero image needed */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(212,160,60,0.08), transparent 60%), radial-gradient(ellipse at bottom, rgba(155,44,60,0.08), transparent 60%)',
        }}
      />

      <div className="relative w-full max-w-md rounded-xl border border-ink-600 bg-ink-800 p-8 shadow-card">
        <div className="text-center">
          <h1 className="font-display text-4xl tracking-marquee text-marquee-gold">OTT PLATFORM</h1>
          <div className="sprocket-strip" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <h2 className="text-xl font-semibold text-bone-100">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-bone-400">{subtitle}</p>}
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

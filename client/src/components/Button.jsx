export default function Button({ children, isLoading, variant = 'primary', className = '', ...rest }) {
  const base =
    'w-full rounded-md py-2.5 font-semibold tracking-wide transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60';

  const variants = {
    primary: 'bg-marquee-gold text-ink-950 hover:brightness-110 active:scale-[0.99]',
    ghost: 'bg-transparent text-bone-100 border border-ink-600 hover:border-marquee-gold',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={isLoading} {...rest}>
      {isLoading ? 'Please wait…' : children}
    </button>
  );
}

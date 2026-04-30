type RainDropIconProps = {
  className?: string;
};

export function RainDropIcon({ className = 'h-4.5 w-4.5' }: RainDropIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8.34 12.51c0 2.3 1.9 4.17 4.25 4.17 2.35 0 4.25-1.87 4.25-4.17 0-2.3-1.9-4.16-4.25-4.16-2.35 0-4.25 1.86-4.25 4.16Z" />
      <path d="M66.67 33.33L33.33 66.67M33.33 33.33L66.67 66.67" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

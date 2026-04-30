type WindIconProps = {
  className?: string;
};

export function WindIcon({ className = 'h-3 w-3' }: WindIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M2 10h8M2 16h12M20 6H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

type RefreshIconProps = {
  className?: string;
};

export function RefreshIcon({ className = 'h-5 w-5' }: RefreshIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M4 12a8 8 0 0 1 15.29-2.6M20 12a8 8 0 0 1-15.29 2.6M4 16v-4h4M20 8v4h-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

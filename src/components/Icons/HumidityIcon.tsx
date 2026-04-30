type HumidityIconProps = {
  className?: string;
};

export function HumidityIcon({ className = 'h-3 w-3' }: HumidityIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.5 22.08c-.27 0-.55-.1-.77-.3-4.6-4.01-7.61-7.55-7.61-11.78 0-4.8 3.65-8.5 8.38-8.5 4.73 0 8.38 3.7 8.38 8.5 0 4.23-3 7.77-7.61 11.78-.22.2-.5.3-.77.3Z" />
    </svg>
  );
}

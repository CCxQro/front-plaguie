import type { ReactNode } from 'react';

export type PlagueAlertIconName = 'alerta' | 'ubicacion' | 'tiempo' | 'plaga';

function IconAlerta({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path
        d="M10 2.2 18 17.2H2L10 2.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M10 7v4.6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="10" cy="14.6" r="1" fill="currentColor" />
    </svg>
  );
}

function IconUbicacion({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true" className={className}>
      <path
        d="M7 12.2c2.5-2.3 3.8-4.2 3.8-5.8A3.8 3.8 0 1 0 3.2 6.4c0 1.6 1.3 3.5 3.8 5.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="6.2" r="1.35" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function IconTiempo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true" className={className}>
      <circle cx="7" cy="7" r="5.8" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 3.8v3.5l2.2 1.3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconPlaga({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true" className={className}>
      <path d="M7 4.2a2.35 2.35 0 1 0 0 4.7 2.35 2.35 0 0 0 0-4.7Z" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <path d="M7 2.2v1.1M4 3.2l.9.8M10 3.2l-.9.8M2.7 6h1.1M10.2 6h1.1M4 8.8l.9-.8M10 8.8l-.9-.8M7 8.9V11" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

export function PlagueAlertCardIcon({ icon, className }: { icon: PlagueAlertIconName; className?: string }) {
  const icons: Record<PlagueAlertIconName, ReactNode> = {
    alerta: <IconAlerta className={className} />,
    ubicacion: <IconUbicacion className={className} />,
    tiempo: <IconTiempo className={className} />,
    plaga: <IconPlaga className={className} />,
  };

  return <>{icons[icon]}</>;
}
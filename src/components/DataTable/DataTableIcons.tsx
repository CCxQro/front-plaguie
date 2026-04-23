import type { ReactNode } from 'react';

export type DataTableActionIconName = 'ver' | 'editar' | 'eliminar';

function IconVer({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 14" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M1 7s3.5-5 10-5 10 5 10 5-3.5 5-10 5S1 7 1 7Zm10 2.6A2.6 2.6 0 1 0 11 4.4a2.6 2.6 0 0 0 0 5.2Z"
      />
    </svg>
  );
}

function IconEditar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m12.7 2.2 3.1 3.1L6.2 14.9l-3.8.7.7-3.8 9.6-9.6Zm0 0 1.1-1.1a1.6 1.6 0 1 1 2.3 2.3L15 4.5"
      />
    </svg>
  );
}

function IconEliminar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M3 4.5h12M6.8 4.5V3.2a1 1 0 0 1 1-1h2.4a1 1 0 0 1 1 1v1.3m2.1 0-.5 9.3a1.4 1.4 0 0 1-1.4 1.3H6.6a1.4 1.4 0 0 1-1.4-1.3l-.5-9.3"
      />
    </svg>
  );
}

export function DataTableActionIcon({ icon, className }: { icon: DataTableActionIconName; className?: string }) {
  const icons: Record<DataTableActionIconName, ReactNode> = {
    ver: <IconVer className={className} />,
    editar: <IconEditar className={className} />,
    eliminar: <IconEliminar className={className} />,
  };

  return <>{icons[icon]}</>;
}
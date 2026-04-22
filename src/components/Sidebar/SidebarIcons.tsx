import type { ReactNode } from 'react';

export type SidebarIconName =
  | 'dashboard'
  | 'clientes'
  | 'inventario'
  | 'mapa'
  | 'informacion'
  | 'usuarios'
  | 'cubo'
  | 'validacion'
  | 'dashboards'
  | 'ajustes'
  | 'salir';

function IconDashboard({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <rect x="2" y="2" width="6" height="6" rx="1.2" fill="currentColor" />
      <rect x="12" y="2" width="6" height="4" rx="1" fill="currentColor" />
      <rect x="12" y="9" width="6" height="9" rx="1.2" fill="currentColor" />
      <rect x="2" y="11" width="6" height="7" rx="1.2" fill="currentColor" />
    </svg>
  );
}

function IconClientes({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M7 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.2 1.2a2.8 2.8 0 1 0-1.85-4.9 5.2 5.2 0 0 1-.42 4.9h2.27ZM1.5 16.5C1.5 13.95 4.15 12 7 12s5.5 1.95 5.5 4.5a1 1 0 1 1-2 0C10.5 15.12 8.9 14 7 14s-3.5 1.12-3.5 2.5a1 1 0 0 1-2 0Zm11.4.38a1 1 0 1 0 1.99.24c.1-.83.78-1.44 1.62-1.44.9 0 1.64.73 1.64 1.63a1 1 0 1 0 2 0c0-2-1.63-3.63-3.64-3.63-1.87 0-3.42 1.4-3.61 3.2Z"
      />
    </svg>
  );
}

function IconInventario({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <rect x="2.5" y="4" width="15" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6 4V2.8h8V4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M2.5 8.5h15" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconMapa({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path
        d="M2.5 4.5 7.8 2.5l4.4 2 5.3-2v13l-5.3 2-4.4-2-5.3 2v-13Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M7.8 2.5v13M12.2 4.5v13" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconInformacion({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path d="M5 2.8h7l3 3V17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3.8a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 2.8V6h3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 10h6M7 13h6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconUsuarios({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <circle cx="7" cy="6" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2.2 15.8c.2-2.6 2.2-4.2 4.8-4.2s4.6 1.6 4.8 4.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="14.7" cy="6.3" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12.8 14.8c.35-1.7 1.55-2.8 3.2-2.8 1.75 0 3.1 1.3 3.3 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconCubo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path d="M10 2.3 17 6.2v7.7L10 17.7 3 13.9V6.2L10 2.3Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.6 6.6 10 10l6.4-3.4M10 10v7.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconValidacion({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <rect x="4" y="3.5" width="12" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7.5 3.5V2.4h5V3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m7.4 10 2.1 2.1 3.3-3.3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconDashboards({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path d="M2.5 16.5h15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="4" y="7.5" width="2.5" height="7" rx="1" fill="currentColor" />
      <rect x="8.75" y="4.5" width="2.5" height="10" rx="1" fill="currentColor" />
      <rect x="13.5" y="9.5" width="2.5" height="5" rx="1" fill="currentColor" />
    </svg>
  );
}

function IconAjustes({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M11 1.8a1 1 0 0 0-2 0v1.03a7.34 7.34 0 0 0-1.98.82l-.73-.73a1 1 0 0 0-1.42 1.41l.73.73a7.34 7.34 0 0 0-.82 1.98H3.75a1 1 0 1 0 0 2h1.03c.16.7.44 1.37.82 1.98l-.73.73a1 1 0 1 0 1.42 1.42l.73-.73c.61.38 1.28.66 1.98.82v1.03a1 1 0 1 0 2 0v-1.03c.7-.16 1.37-.44 1.98-.82l.73.73a1 1 0 1 0 1.42-1.42l-.73-.73c.38-.61.66-1.28.82-1.98h1.03a1 1 0 1 0 0-2h-1.03a7.34 7.34 0 0 0-.82-1.98l.73-.73a1 1 0 1 0-1.42-1.41l-.73.73A7.34 7.34 0 0 0 11 2.83V1.8Zm-1 11.2a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
      />
    </svg>
  );
}

function IconSalir({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path d="M8 3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.5 6.5 15 10l-4.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 10H15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconLogoLeaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path d="M16.8 3.2c-6.7 0-11.1 2.2-13 6.6a5.87 5.87 0 0 0 7.45 7.64c4.3-1.73 6.75-6.3 6.75-14.2a.95.95 0 0 0-.95-.95h-.25ZM6.8 14.5c2.45-2.8 4.78-4.37 7.88-5.2-2.35 1.42-4.2 3.3-5.95 6.05a.9.9 0 1 1-1.93-.85Z" fill="currentColor" />
    </svg>
  );
}

function IconLogoCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="m8.4 12.1 2.4 2.5 4.8-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SidebarIcon({ icon, className }: { icon: SidebarIconName; className?: string }) {
  const icons: Record<SidebarIconName, ReactNode> = {
    dashboard: <IconDashboard className={className} />,
    clientes: <IconClientes className={className} />,
    inventario: <IconInventario className={className} />,
    mapa: <IconMapa className={className} />,
    informacion: <IconInformacion className={className} />,
    usuarios: <IconUsuarios className={className} />,
    cubo: <IconCubo className={className} />,
    validacion: <IconValidacion className={className} />,
    dashboards: <IconDashboards className={className} />,
    ajustes: <IconAjustes className={className} />,
    salir: <IconSalir className={className} />,
  };

  return <>{icons[icon]}</>;
}

export { IconLogoCheck, IconLogoLeaf };
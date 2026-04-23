import type { ReactNode } from 'react';

export type OrderTableIconName = 'ver' | 'aprobar' | 'rechazar';

function IconVer({ className }: { className?: string }) {
  return (
    <svg width="22" height="15" viewBox="0 0 22 14" aria-hidden="true" className={className}>
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

function IconAprobar({ className }: { className?: string }) {
  return (
    <svg width="13" height="10" viewBox="0 0 13 10" aria-hidden="true" className={className}>
      <path
        d="m1.2 5.4 3 3 7-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconRechazar({ className }: { className?: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true" className={className}>
      <path
        d="M1 1 10 10M10 1 1 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function OrderTableIcon({ icon, className }: { icon: OrderTableIconName; className?: string }) {
  const icons: Record<OrderTableIconName, ReactNode> = {
    ver: <IconVer className={className} />,
    aprobar: <IconAprobar className={className} />,
    rechazar: <IconRechazar className={className} />,
  };

  return <>{icons[icon]}</>;
}
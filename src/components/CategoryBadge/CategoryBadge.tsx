import type { CSSProperties } from 'react';

interface CategoryBadgeProps {
  label: string;
  color: string;
  /** Tailwind width class, e.g. 'w-auto', 'w-24', 'w-[88px]' */
  width?: string;
  /** Tailwind height class, e.g. 'h-6', 'h-8', 'h-[24px]' */
  height?: string;
}

function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function CategoryBadge({ label, color, width = 'w-auto', height = 'h-6' }: CategoryBadgeProps) {
  const bg = hexToRgba(color, 0.12);
  return (
    <span
      className={`inline-flex items-center justify-center px-3 ${width} ${height} rounded-full font-bold text-xs leading-4 whitespace-nowrap text-(--badge-color) bg-(--badge-bg)`}
      style={{ '--badge-color': color, '--badge-bg': bg } as CSSProperties}
      data-testid="category-badge"
    >
      {label}
    </span>
  );
}

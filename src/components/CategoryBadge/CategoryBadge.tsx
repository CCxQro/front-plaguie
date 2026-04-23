import React from 'react';

interface CategoryBadgeProps {
  label: string;
  color: string;
  /** Tailwind width class, e.g. 'w-auto', 'w-24', 'w-[88px]' */
  width?: string;
  /** Tailwind height class, e.g. 'h-6', 'h-8', 'h-[24px]' */
  height?: string;
}

/**
 * Converts a hex color string to an rgba string with the given alpha.
 */
function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  label,
  color,
  width = 'w-auto',
  height = 'h-6',
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center px-3 ${width} ${height} rounded-full font-inter font-bold text-xs leading-4 whitespace-nowrap`}
      style={{
        backgroundColor: hexToRgba(color, 0.12),
        color: color,
      }}
    >
      {label}
    </span>
  );
};

export default CategoryBadge;

import CategoryBadge from '../CategoryBadge/CategoryBadge';
import { useFirebaseImageUrl } from '../../hooks/useFirebaseImageUrl';
import { DataTableActionIcon } from './DataTableIcons';

export type InventoryStockState = 'ok' | 'bajo' | 'agotado';

export interface InventoryTableRowData {
  id: string;
  product: string;
  sku: string;
  category: string;
  categoryColor: string;
  price: string;
  stock: number;
  stockMax: number;
  stockState: InventoryStockState;
  stockLabel?: string;
  imageUrl?: string;
  imagePath?: string;
}

export interface InventoryTableRowProps {
  row: InventoryTableRowData;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const STOCK_STYLES: Record<InventoryStockState, { bar: string; helper: string }> = {
  ok: { bar: 'bg-[#00C950]', helper: 'text-[#008236]' },
  bajo: { bar: 'bg-[#FF6900]', helper: 'text-[#F54900]' },
  agotado: { bar: 'bg-[#FB2C36]', helper: 'text-[#E7000B]' },
};

function RowImage({
  imageUrl,
  imagePath,
  alt,
}: {
  imageUrl?: string;
  imagePath?: string;
  alt: string;
}) {
  const { data: resolvedUrl } = useFirebaseImageUrl(imageUrl ? undefined : imagePath);
  const src = imageUrl ?? resolvedUrl;

  return (
    <div className="grid h-12 w-12 place-content-center overflow-hidden rounded-xl bg-[#F1F5F9]">
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="text-lg text-[#94A3B8]">📦</span>
      )}
    </div>
  );
}

function ActionButton({
  icon,
  onClick,
}: {
  icon: 'ver' | 'editar' | 'eliminar';
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-8 w-8 place-content-center rounded-xl transition-colors hover:bg-[#F8FAFC]"
    >
      <DataTableActionIcon icon={icon} className="h-4 w-4 text-[#475569]" />
    </button>
  );
}

export function InventoryTableRow({ row, onView, onEdit, onDelete }: InventoryTableRowProps) {
  const stockStyles = STOCK_STYLES[row.stockState];
  const fillWidth =
    row.stockMax > 0 ? Math.max(0, Math.min(100, (row.stock / row.stockMax) * 100)) : 0;

  return (
    <tr className="border-b border-[#F1F5F9]" data-testid="inventory-table-row">
      <td className="px-6 py-4 align-middle">
        <RowImage imageUrl={row.imageUrl} imagePath={row.imagePath} alt={row.product} />
      </td>

      <td className="px-6 py-4 align-middle">
        <p className="truncate text-sm font-bold leading-5 text-[#0F172B]">{row.product}</p>
        <p className="truncate text-xs leading-4 text-[#62748E]">SKU: {row.sku}</p>
      </td>

      <td className="px-6 py-4 align-middle">
        <CategoryBadge label={row.category} color={row.categoryColor} />
      </td>

      <td className="px-6 py-4 align-middle text-sm font-bold leading-5 text-[#0F172B]">
        {row.price}
      </td>

      <td className="px-6 py-4 align-middle">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-[#F1F5F9]">
              <div
                className={`h-full rounded-full ${stockStyles.bar} w-(--fill) [--fill:${fillWidth}%]`}
              />
            </div>
            <span className="text-sm font-bold leading-5 text-[#0F172B] tabular-nums">
              {row.stock}
            </span>
          </div>
          {row.stockLabel && (
            <p className={`text-xs leading-4 ${stockStyles.helper}`}>{row.stockLabel}</p>
          )}
        </div>
      </td>

      <td className="px-6 py-4 align-middle">
        <div className="flex justify-end gap-2">
          <ActionButton icon="ver" onClick={() => onView?.(row.id)} />
          <ActionButton icon="editar" onClick={() => onEdit?.(row.id)} />
          <ActionButton icon="eliminar" onClick={() => onDelete?.(row.id)} />
        </div>
      </td>
    </tr>
  );
}

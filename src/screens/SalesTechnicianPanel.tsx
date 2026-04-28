import type { ReactNode } from 'react';

import { MetricCard } from '../components/MetricCard';
import { MapCard } from '../components/MapCard';
import CategoryBadge from '../components/CategoryBadge/CategoryBadge';
import { SearchIcon } from '../components/Icons/SearchIcon';
import { BellIcon } from '../components/Icons/BellIcon';
import { MetricPeopleIcon } from '../components/Icons/MetricPeopleIcon';
import { MetricAddUserIcon } from '../components/Icons/MetricAddUserIcon';
import { MetricMoneyIcon } from '../components/Icons/MetricMoneyIcon';
import { InventoryGlyph } from '../components/Icons/InventoryGlyph';
import { SalesChartCard } from '../components/SalesChartCard/SalesChartCard';
import { WarningMetricCard } from '../components/WarningMetricCard/WarningMetricCard';
import useAuthStore from '../services/Contexts/useAuthStore';

type MetricCardData = {
  title: string;
  value: string;
  trend: string;
  icon: ReactNode;
};

type InventoryRow = {
  id: string;
  product: string;
  sku: string;
  category: string;
  categoryColor: string;
  stock: string;
  lastSale: string;
  status: string;
  statusClassName: string;
};

const METRICS: MetricCardData[] = [
  {
    title: 'Clientes Totales',
    value: '1,284',
    trend: '+5.2%',
    icon: <MetricPeopleIcon />,
  },
  {
    title: 'Nuevos Clientes (Mes)',
    value: '42',
    trend: '+12%',
    icon: <MetricAddUserIcon />,
  },
  {
    title: 'Ventas del Mes',
    value: '$12,500.00',
    trend: '+8.4%',
    icon: <MetricMoneyIcon />,
  },
];

const INVENTORY_ROWS: InventoryRow[] = [
  {
    id: 'fungicida-x2-premium',
    product: 'Fungicida X2 Premium',
    sku: 'F-1024',
    category: 'Plaguicidas',
    categoryColor: '#CA3500',
    stock: '5 unidades',
    lastSale: 'Hace 2 horas',
    status: 'Crítico',
    statusClassName: 'bg-[#FEE2E2] text-[#DC2626]',
  },
  {
    id: 'insecticida-organico-v-bio',
    product: 'Insecticida Orgánico V-Bio',
    sku: 'I-2211',
    category: 'Orgánicos',
    categoryColor: '#1447E6',
    stock: '12 unidades',
    lastSale: 'Hace 1 día',
    status: 'Bajo',
    statusClassName: 'bg-[#FFEDD5] text-[#EA580C]',
  },
  {
    id: 'herbicida-pro-extreme',
    product: 'Herbicida Pro Extreme',
    sku: 'H-3308',
    category: 'Herbicidas',
    categoryColor: '#CA3500',
    stock: '8 unidades',
    lastSale: 'Ayer',
    status: 'Bajo',
    statusClassName: 'bg-[#FFEDD5] text-[#EA580C]',
  },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function SalesTechnicianPanel() {
  const { user } = useAuthStore();
  const userName = user?.name ?? 'Técnico';

  return (
    <div className="min-h-full bg-[#F6F7F7] text-[#0F172A]">
      <header className="flex h-18.5 items-center justify-between border-b border-[#E2E8F0] bg-[rgba(255,255,255,0.8)] px-8 backdrop-blur-[6px]">
        <h1 className="text-[20px] leading-7 text-[#0F172A]">Dashboard de Técnico de Ventas</h1>

        <div className="flex items-center gap-3">
          <label className="relative block">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#90A1B9]">
              <SearchIcon />
            </span>
            <input
              type="search"
              placeholder="Buscar clientes, pedidos..."
              className="h-10 w-[256px] rounded-lg bg-[#F1F5F9] pl-9 pr-4 text-[14px] leading-4.25 text-[#0F172A] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#75C79E]/25"
            />
          </label>

          <button
            type="button"
            className="relative grid h-9 w-9 place-content-center rounded-lg text-[#64748B] transition hover:bg-white"
            aria-label="Notificaciones"
          >
            <BellIcon />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-[#EF4444]" />
          </button>
        </div>
      </header>

      <main className="px-8 pb-8 pt-8">
        <section className="mb-6 rounded-2xl border border-[#E2E8F0] bg-white px-6 py-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <p className="text-sm text-[#64748B]">Bienvenido, <span className="font-medium text-[#0F172A]">{userName}</span></p>
          <h2 className="mt-1 text-[28px] font-semibold leading-9 text-[#0F172A]">Panel de Técnico de Ventas</h2>
          <p className="mt-2 max-w-2xl text-[14px] leading-5.25 text-[#475569]">
            Aquí puedes revisar clientes, inventario, alertas y reportes desde el dashboard principal.
          </p>
        </section>

        <section className="grid gap-4 xl:grid-cols-4">
          {METRICS.map((metric) => (
            <MetricCard key={metric.title} data={metric} variant="default" className="h-40.5 max-w-none" />
          ))}

          <WarningMetricCard />
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <SalesChartCard />

          <MapCard
            data={{
              title: 'Incidentes',
              value: 'Activos',
              actionLabel: 'Ver mapa completo',
              description: '5 alertas críticas',
            }}
            variant="locations"
            className="h-98.25 max-w-none"
          />

          <MapCard
            data={{
              title: 'Clima por',
              value: 'Región',
              actionLabel: 'Ver reporte completo',
              description: 'Precipitaciones sur',
            }}
            variant="weather"
            className="h-98.25 max-w-none"
          />
        </section>

        <section className="mt-4 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between gap-4 border-b border-[#F1F5F9] px-6 py-6">
            <h2 className="text-[18px] font-medium leading-6.75 text-[#0F172A]">Resumen de Inventario - Stock Bajo</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-277.25 w-full border-collapse">
              <thead>
                <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC] text-left text-[12px] uppercase tracking-[0.6px] text-[#64748B]">
                  <th className="px-6 py-4.25 font-normal">Producto</th>
                  <th className="px-6 py-4.25 font-normal">Categoría</th>
                  <th className="px-6 py-4.25 font-normal">Stock Actual</th>
                  <th className="px-6 py-4.25 font-normal">Última Venta</th>
                  <th className="px-6 py-4.25 font-normal">Estado</th>
                </tr>
              </thead>

              <tbody>
                {INVENTORY_ROWS.map((row) => (
                  <tr key={row.id} className="border-b border-[#F1F5F9] last:border-b-0">
                    <td className="px-6 py-5 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-content-center rounded-sm bg-[#F1F5F9] text-[#75C79E]">
                          <InventoryGlyph />
                        </div>
                        <div>
                          <p className="text-[14px] leading-5.25 text-[#0F172A]">{row.product}</p>
                          <p className="text-[12px] leading-4 text-[#64748B]">SKU: {row.sku}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 align-middle">
                      <CategoryBadge label={row.category} color={row.categoryColor} width="w-auto" height="h-6" />
                    </td>

                    <td className="px-6 py-5 align-middle text-[14px] leading-5.25 text-[#DC2626]">{row.stock}</td>

                    <td className="px-6 py-5 align-middle text-[14px] leading-5.25 text-[#64748B]">{row.lastSale}</td>

                    <td className="px-6 py-5 align-middle">
                      <span
                        className={cx(
                          'inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase leading-3.75',
                          row.statusClassName,
                        )}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center border-t border-[#F1F5F9] bg-[#F8FAFC] px-6 py-4">
            <button type="button" className="text-[12px] font-medium uppercase tracking-[1.2px] text-[#64748B]">
              Ver Inventario Completo
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SalesTechnicianPanel;

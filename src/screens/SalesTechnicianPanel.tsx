import { useState } from 'react';

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
import { WeatherModal } from '../components/WeatherModal';
import { PlagueAlertsModal } from '../components/PlagueAlertsModal';
import useAuthStore from '../services/Contexts/useAuthStore';

import { useSalesSummary } from '../hooks/useSalesSummary';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function SalesTechnicianPanel() {
  const { user } = useAuthStore();
  const userName = user?.name ?? 'Técnico';
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [isPlagueAlertsModalOpen, setIsPlagueAlertsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { data, isLoading } = useSalesSummary(startDate || undefined, endDate || undefined);

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#64748B]">Bienvenido, <span className="font-medium text-[#0F172A]">{userName}</span></p>
              <h2 className="mt-1 text-[28px] font-semibold leading-9 text-[#0F172A]">Panel de Técnico de Ventas</h2>
              <p className="mt-2 max-w-2xl text-[14px] leading-5.25 text-[#475569]">
                Aquí puedes revisar clientes, inventario, alertas y reportes desde el dashboard principal.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0]">
              <div className="flex flex-col">
                <label className="text-xs text-[#64748B] ml-1 mb-1">Desde</label>
                <input 
                  type="date" 
                  className="bg-white border border-[#E2E8F0] rounded-md px-2 py-1.5 text-sm"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-[#64748B] ml-1 mb-1">Hasta</label>
                <input 
                  type="date" 
                  className="bg-white border border-[#E2E8F0] rounded-md px-2 py-1.5 text-sm"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-4">
          <MetricCard
            data={{
              title: 'Ventas Totales',
              value: data ? `$${data.metrics.totalEarnings.toLocaleString()}` : '$0',
              trend: data?.metrics.earningsTrend || '0%',
              icon: <MetricMoneyIcon />,
            }}
            variant="default"
            className="h-40.5 max-w-none"
          />
          <MetricCard
            data={{
              title: 'Nuevos Clientes',
              value: data ? data.metrics.newClients.toLocaleString() : '0',
              trend: data?.metrics.clientsTrend || '0%',
              icon: <MetricAddUserIcon />,
            }}
            variant="default"
            className="h-40.5 max-w-none"
          />
          <MetricCard
            data={{
              title: 'Pedidos',
              value: data ? data.metrics.totalOrders.toLocaleString() : '0',
              trend: data?.metrics.ordersTrend || '0%',
              icon: <MetricPeopleIcon />,
            }}
            variant="default"
            className="h-40.5 max-w-none"
          />
          <WarningMetricCard />
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <SalesChartCard salesData={data?.salesChartData?.map(d => ({ date: d.date, sales: d.amount, revenue: d.amount })) || []} />

          <MapCard
            data={{
              title: 'Incidentes',
              value: 'Activos',
              actionLabel: 'Ver mapa completo',
              description: '5 alertas críticas',
            }}
            variant="locations"
            onLocationsClick={() => setIsPlagueAlertsModalOpen(true)}
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
            onWeatherClick={() => setIsWeatherModalOpen(true)}
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
                {isLoading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">Cargando inventario...</td>
                  </tr>
                )}
                {data?.inventoryAlerts.map((row) => (
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
                      <CategoryBadge label={row.category} color={row.category === 'Plaguicidas' ? '#CA3500' : '#1447E6'} width="w-auto" height="h-6" />
                    </td>

                    <td className="px-6 py-5 align-middle text-[14px] leading-5.25 text-[#DC2626]">{row.stock} unidades</td>

                    <td className="px-6 py-5 align-middle text-[14px] leading-5.25 text-[#64748B]">{new Date(row.lastSaleDate).toLocaleDateString()}</td>

                    <td className="px-6 py-5 align-middle">
                      <span
                        className={cx(
                          'inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase leading-3.75',
                          row.status === 'Crítico' ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#FFEDD5] text-[#EA580C]'
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

        <WeatherModal isOpen={isWeatherModalOpen} onClose={() => setIsWeatherModalOpen(false)} />
        </section>
      </main>

      <PlagueAlertsModal isOpen={isPlagueAlertsModalOpen} onClose={() => setIsPlagueAlertsModalOpen(false)} />
    </div>
  );
}

export default SalesTechnicianPanel;

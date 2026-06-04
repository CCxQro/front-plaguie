import { useAdminMetrics } from '../hooks/useAdminMetrics';
import { MetricCard } from '../components/MetricCard/MetricCard';
import { SidebarIcon } from '../components/Sidebar/SidebarIcons';

export default function AdminOverviewPanel() {
  const { data, isLoading, isError, error, refetch } = useAdminMetrics();

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-7xl mx-auto w-full min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Resumen general del sistema de vigilancia y marketplace.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center p-12">
          <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-emerald-600 animate-spin mb-4" />
          <p className="text-sm font-medium text-gray-500">Cargando métricas...</p>
        </div>
      )}

      {isError && (
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-red-100 shadow-sm">
          <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <SidebarIcon icon="informacion" className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Error al cargar métricas</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-md text-center">
            {error?.message || 'Hubo un problema al conectar con el servidor.'}
          </p>
          <button 
            onClick={() => refetch()}
            className="mt-6 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
          >
            Reintentar
          </button>
        </div>
      )}

      {data && !isLoading && !isError && (
        <div className="space-y-8">
          {/* Main metrics section */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Métricas Principales</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                variant="highlight"
                data={{
                  title: 'Usuarios Totales',
                  value: data.totalUsers.toLocaleString(),
                  trend: `+${data.newUsersThisWeek} esta semana`,
                  icon: <SidebarIcon icon="usuarios" className="h-5 w-5" />
                }}
                className="w-full max-w-none"
              />
              <MetricCard
                data={{
                  title: 'Validaciones Pendientes',
                  value: data.pendingValidations.toLocaleString(),
                  description: 'Productos y cuentas por revisar',
                  icon: <SidebarIcon icon="validacion" className="h-5 w-5" />
                }}
                className="w-full max-w-none"
              />
              <MetricCard
                data={{
                  title: 'Registros Fitosanitarios',
                  value: data.totalSurveillanceRecords.toLocaleString(),
                  trend: `+${data.recordsThisMonth} este mes`,
                  icon: <SidebarIcon icon="mapa" className="h-5 w-5" />
                }}
                className="w-full max-w-none"
              />
              <MetricCard
                data={{
                  title: 'Pedidos Completados',
                  value: data.totalOrders.toLocaleString(),
                  trend: `+${data.ordersThisWeek} esta semana`,
                  icon: <SidebarIcon icon="cubo" className="h-5 w-5" />
                }}
                className="w-full max-w-none"
              />
            </div>
          </div>

          {/* Secondary details or charts placeholders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Estado del Inventario Global</h3>
                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <SidebarIcon icon="inventario" className="h-5 w-5" />
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 font-medium">Total de Productos</span>
                  <span className="text-lg font-bold text-gray-900">{data.totalProducts.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500">
                  Resumen general del catálogo disponible en el marketplace de todos los vendedores autorizados.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl border border-emerald-700 p-6 shadow-md text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
                <SidebarIcon icon="dashboards" className="h-48 w-48" />
              </div>
              <div className="relative z-10">
                <h3 className="font-semibold text-emerald-50 mb-2">Visión General</h3>
                <p className="text-emerald-100 text-sm mb-8 max-w-md leading-relaxed">
                  El sistema se encuentra monitoreando activamente la actividad comercial y fitosanitaria del país. Las métricas reflejan datos en tiempo real de todos los módulos operando conjuntamente.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs font-medium text-emerald-50">Sistema Estable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

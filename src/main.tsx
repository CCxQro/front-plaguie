import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import Login from './screens/Login'
import StatusPage from './screens/StatusPage'
import AdminLayout from './screens/AdminLayout'
import AdminOverviewPanel from './screens/AdminOverviewPanel'
import GestionUsuariosPanel from './screens/GestionUsuariosPanel'
import InventarioPanel from './screens/InventarioPanel'
import ValidacionPanel from './screens/ValidacionPanel'
import DashboardsPanel from './screens/DashboardsPanel'
import AgricultorPanel from './screens/AgricultorPanel'
import SalesTechnicianPanel from './screens/SalesTechnicianPanel'
import SalesTechnicianLayout from './screens/SalesTechnicianLayout'
import VentasPanel from './screens/VentasPanel'
import ClientesPanel from './screens/ClientesPanel'
import ProductosPanel from './screens/ProductosPanel'
import ReportesPanel from './screens/ReportesPanel'
import RegionesInteresPanel from './screens/RegionesInteresPanel'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import { DefaultRedirect } from './components/DefaultRedirect/DefaultRedirect'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/status" element={<StatusPage />} />

          {/* Admin only */}
          <Route path="/app" element={
            <ProtectedRoute allowedRoles={[1]}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="usuarios" replace />} />
            <Route path="dashboard" element={<AdminOverviewPanel />} />
            <Route path="usuarios" element={<GestionUsuariosPanel />} />
            <Route path="inventario" element={<InventarioPanel />} />
            <Route path="validacion" element={<ValidacionPanel />} />
            <Route path="dashboards" element={<DashboardsPanel />} />
          </Route>

          {/* Agricultor only */}
          <Route path="/agricultor" element={
            <ProtectedRoute allowedRoles={[2]}>
              <AgricultorPanel />
            </ProtectedRoute>
          } />

          {/* Sales Technician only */}
          <Route path="/sales-technician" element={
            <ProtectedRoute allowedRoles={[3]}>
              <SalesTechnicianLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="inicio" replace />} />
            <Route path="inicio" element={<SalesTechnicianPanel />} />
            <Route path="ventas" element={<VentasPanel />} />
            <Route path="clientes" element={<ClientesPanel />} />
            <Route path="productos" element={<ProductosPanel />} />
            <Route path="reportes" element={<ReportesPanel />} />
            <Route path="regiones" element={<RegionesInteresPanel />} />
          </Route>

          {/* Unknown routes → default page or login */}
          <Route path="*" element={<DefaultRedirect />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)

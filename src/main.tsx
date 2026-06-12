import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import Login from './screens/auth/Login'
import StatusPage from './screens/auth/StatusPage'
import AdminLayout from './screens/admin/AdminLayout'
import GestionUsuariosPanel from './screens/admin/usuarios/GestionUsuariosPanel'
import InventarioPanel from './screens/admin/InventarioPanel'
import ValidacionPanel from './screens/admin/ValidacionPanel'
import ActualizacionDatosPanel from './screens/admin/ActualizacionDatosPanel'
import AgricultorPanel from './screens/agricultor/AgricultorPanel'
import SalesTechnicianPanel from './screens/ventas/SalesTechnicianPanel'
import SalesTechnicianLayout from './screens/ventas/SalesTechnicianLayout'
import ClientesPanel from './screens/ventas/ClientesPanel'
import ProductosPanel from './screens/ventas/ProductosPanel'
import ReportesPanel from './screens/ventas/ReportesPanel'
import AlertasCercanasPanel from './screens/ventas/AlertasCercanasPanel'
import MapaPlagasPanel from './screens/ventas/MapaPlagasPanel'
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
            <Route path="usuarios" element={<GestionUsuariosPanel />} />
            <Route path="inventario" element={<InventarioPanel />} />
            <Route path="validacion" element={<ValidacionPanel />} />
            <Route path="actualizaciones" element={<ActualizacionDatosPanel />} />
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
            <Route path="clientes" element={<ClientesPanel />} />
            <Route path="productos" element={<ProductosPanel />} />
            <Route path="reportes" element={<ReportesPanel />} />
            <Route path="alertas" element={<AlertasCercanasPanel />} />
            <Route path="mapa" element={<MapaPlagasPanel />} />
          </Route>

          {/* Unknown routes → default page or login */}
          <Route path="*" element={<DefaultRedirect />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)

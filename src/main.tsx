import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Login from './screens/Login'
import MyApp from './screens/MyApp'
import AgricultorPanel from './screens/AgricultorPanel'
import SalesTechnicianPanel from './screens/SalesTechnicianPanel'
import SalesTechnicianLayout from './screens/SalesTechnicianLayout'
import VentasPanel from './screens/VentasPanel'
import ClientesPanel from './screens/ClientesPanel'
import ProductosPanel from './screens/ProductosPanel'
import ReportesPanel from './screens/ReportesPanel'
import ProtectedRoute, { getDefaultRoute } from './components/ProtectedRoute/ProtectedRoute'
import useAuthStore from './services/Contexts/useAuthStore'

function DefaultRedirect() {
  const { user, isAuthenticated } = useAuthStore();

  if (isAuthenticated && user) {
    return <Navigate to={getDefaultRoute(user.roleId)} replace />;
  }

  return <Navigate to="/login" replace />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Admin only */}
        <Route path="/app" element={
          <ProtectedRoute allowedRoles={[1]}>
            <MyApp />
          </ProtectedRoute>
        } />

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
        </Route>

        {/* Unknown routes → default page or login */}
        <Route path="*" element={<DefaultRedirect />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

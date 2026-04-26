import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Login from './screens/Login'
import MyApp from './screens/MyApp'
import AgricultorPanel from './screens/AgricultorPanel'
import SalesTechnicianPanel from './screens/SalesTechnicianPanel'
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
            <SalesTechnicianPanel />
          </ProtectedRoute>
        } />

        {/* Unknown routes → default page or login */}
        <Route path="*" element={<DefaultRedirect />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

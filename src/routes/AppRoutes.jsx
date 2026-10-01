import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { PageLoader } from '../components/Common'
import { ProtectedRoute } from '../components/Guards'

const LandingPage = lazy(() => import('../pages/LandingPage'))
const LoginPage = lazy(() => import('../pages/AuthPages').then(module => ({ default: module.LoginPage })))
const RegisterPage = lazy(() => import('../pages/AuthPages').then(module => ({ default: module.RegisterPage })))
const OnboardingPage = lazy(() => import('../pages/OnboardingPage'))
const CitizenLayout = lazy(() => import('../components/Layouts').then(module => ({ default: module.CitizenLayout })))
const AdminLayout = lazy(() => import('../components/Layouts').then(module => ({ default: module.AdminLayout })))
const CitizenHome = lazy(() => import('../pages/citizen/CitizenHome'))
const ReportEmergency = lazy(() => import('../pages/citizen/ReportEmergency'))
const IncidentDetail = lazy(() => import('../pages/citizen/IncidentsPages').then(module => ({ default: module.IncidentDetail })))
const MyIncidents = lazy(() => import('../pages/citizen/IncidentsPages').then(module => ({ default: module.MyIncidents })))
const ProfilePage = lazy(() => import('../pages/citizen/AlertsResourcesProfile').then(module => ({ default: module.ProfilePage })))
const ResourcesPage = lazy(() => import('../pages/citizen/AlertsResourcesProfile').then(module => ({ default: module.ResourcesPage })))
const SafetyMapPage = lazy(() => import('../pages/citizen/UnifiedSafetyMapPage'))
const CommunityPage = lazy(() => import('../pages/citizen/CommunityPage').then(module => ({ default: module.CommunityPage })))
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'))
const AdminIncidentDetail = lazy(() => import('../pages/admin/AdminIncidents').then(module => ({ default: module.AdminIncidentDetail })))
const AdminIncidents = lazy(() => import('../pages/admin/AdminIncidents').then(module => ({ default: module.AdminIncidents })))
const AnalyticsPage = lazy(() => import('../pages/admin/DispatchAlertsAnalytics').then(module => ({ default: module.AnalyticsPage })))
const DispatchPage = lazy(() => import('../pages/admin/DispatchAlertsAnalytics').then(module => ({ default: module.DispatchPage })))
const PublicAlertsAdmin = lazy(() => import('../pages/admin/DispatchAlertsAnalytics').then(module => ({ default: module.PublicAlertsAdmin })))
const RiskZonesPage = lazy(() => import('../pages/admin/RiskZonesPage'))
const UnitsPage = lazy(() => import('../pages/admin/OperationsPages').then(module => ({ default: module.UnitsPage })))
const HospitalsPage = lazy(() => import('../pages/admin/OperationsPages').then(module => ({ default: module.HospitalsPage })))
const PublicationsAdminPage = lazy(() => import('../pages/admin/OperationsPages').then(module => ({ default: module.PublicationsAdminPage })))
const AuditPage = lazy(() => import('../pages/admin/OperationsPages').then(module => ({ default: module.AuditPage })))
const ScenariosPage = lazy(() => import('../pages/admin/OperationsPages').then(module => ({ default: module.ScenariosPage })))

const routeTitles = [
  [/^\/$/, 'PULSE 911 — Simulación de respuesta'],
  [/^\/login$/, 'Iniciar sesión — PULSE 911'],
  [/^\/register$/, 'Crear cuenta — PULSE 911'],
  [/^\/onboarding$/, 'Ficha de emergencia — PULSE 911'],
  [/^\/app\/report$/, 'Reportar emergencia — PULSE 911'],
  [/^\/app\/map$/, 'Mapa situacional — PULSE 911'],
  [/^\/app\/incidents\//, 'Detalle del incidente — PULSE 911'],
  [/^\/app\/incidents$/, 'Mis incidentes — PULSE 911'],
  [/^\/app\/alerts$/, 'Alertas — PULSE 911'],
  [/^\/app\/resources$/, 'Recursos — PULSE 911'],
  [/^\/app\/profile$/, 'Perfil — PULSE 911'],
  [/^\/app\/community$/, 'Reportes ciudadanos — PULSE 911'],
  [/^\/app$/, 'Portal ciudadano — PULSE 911'],
  [/^\/command\/incidents\//, 'Detalle operativo — PULSE Command'],
  [/^\/command\/incidents$/, 'Incidentes — PULSE Command'],
  [/^\/command\/dispatch$/, 'Despacho — PULSE Command'],
  [/^\/command\/risk-zones$/, 'Zonas de riesgo — PULSE Command'],
  [/^\/command\/alerts$/, 'Alertas públicas — PULSE Command'],
  [/^\/command\/analytics$/, 'Analítica — PULSE Command'],
  [/^\/command\/units$/, 'Unidades — PULSE Command'],
  [/^\/command\/hospitals$/, 'Hospitales — PULSE Command'],
  [/^\/command\/publications$/, 'Publicaciones — PULSE Command'],
  [/^\/command\/audit$/, 'Auditoría — PULSE Command'],
  [/^\/command\/scenarios$/, 'Escenarios — PULSE Command'],
  [/^\/command$/, 'Centro de mando — PULSE Command'],
]

function RouteMeta() {
  const { pathname } = useLocation()
  useEffect(() => {
    document.title = routeTitles.find(([pattern]) => pattern.test(pathname))?.[1] || 'PULSE 911'
  }, [pathname])
  return null
}

export default function AppRoutes() {
  return <>
    <RouteMeta />
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<ProtectedRoute role="citizen"><OnboardingPage /></ProtectedRoute>} />
        <Route element={<ProtectedRoute role="citizen"><CitizenLayout /></ProtectedRoute>}>
          <Route path="/app" element={<CitizenHome />} />
          <Route path="/app/report" element={<ReportEmergency />} />
          <Route path="/app/map" element={<SafetyMapPage />} />
          <Route path="/app/incidents" element={<MyIncidents />} />
          <Route path="/app/incidents/:id" element={<IncidentDetail />} />
          <Route path="/app/alerts" element={<Navigate to="/app/map" replace />} />
          <Route path="/app/resources" element={<ResourcesPage />} />
          <Route path="/app/profile" element={<ProfilePage />} />
          <Route path="/app/community" element={<CommunityPage />} />
          <Route path="/app/notifications" element={<Navigate to="/app" replace />} />
        </Route>
        <Route element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route path="/command" element={<AdminDashboard />} />
          <Route path="/command/incidents" element={<AdminIncidents />} />
          <Route path="/command/incidents/:id" element={<AdminIncidentDetail />} />
          <Route path="/command/dispatch" element={<DispatchPage />} />
          <Route path="/command/risk-zones" element={<RiskZonesPage />} />
          <Route path="/command/alerts" element={<PublicAlertsAdmin />} />
          <Route path="/command/analytics" element={<AnalyticsPage />} />
          <Route path="/command/units" element={<UnitsPage />} />
          <Route path="/command/hospitals" element={<HospitalsPage />} />
          <Route path="/command/publications" element={<PublicationsAdminPage />} />
          <Route path="/command/audit" element={<AuditPage />} />
          <Route path="/command/scenarios" element={<ScenariosPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </>
}
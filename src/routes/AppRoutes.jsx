import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageLoader } from '../components/Common'
import { ProtectedRoute } from '../components/Guards'
import { NotFoundPage } from '../pages/StatusPages'

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
const NearbyPage = lazy(() => import('../pages/citizen/NearbyPage'))
const RoadStatusPage = lazy(() => import('../pages/citizen/RoadStatusPage'))
const PulseAssistantPage = lazy(() => import('../pages/citizen/PulseAssistantPage'))
const TravelPage = lazy(() => import('../pages/citizen/TravelPage'))
const WellbeingPage = lazy(() => import('../pages/citizen/WellbeingPage'))
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
const AdminAIPage = lazy(() => import('../pages/admin/AdminAIPage'))
const AIReviewPage = lazy(() => import('../pages/admin/AIReviewPage'))
const TrafficMonitorPage = lazy(() => import('../pages/admin/TrafficMonitorPage'))
const UserManagementPage = lazy(() => import('../pages/admin/UserManagementPage'))
const MobilityInsightsPage = lazy(() => import('../pages/citizen/MobilityInsightsPage'))

const routeTitleKeys = [
  [/^\/$/, 'landing.platform'],
  [/^\/login$/, 'auth.loginTitle'],
  [/^\/register$/, 'auth.createTitle'],
  [/^\/onboarding$/, 'legacy.emergencyFile'],
  [/^\/app\/report$/, 'legacy.reportEmergency'],
  [/^\/app\/map$/, 'map.title'],
  [/^\/app\/incidents\//, 'legacy.incident'],
  [/^\/app\/incidents$/, 'nav.incidents'],
  [/^\/app\/alerts$/, 'nav.map'],
  [/^\/app\/resources$/, 'nav.resources'],
  [/^\/app\/profile$/, 'nav.profile'],
  [/^\/app\/community$/, 'nav.community'],
  [/^\/app\/roads$/, 'nav.roads'],
  [/^\/app\/insights$/, 'nav.insights'],
  [/^\/app\/nearby$/, 'nav.nearby'],
  [/^\/app\/assistant$/, 'nav.assistant'],
  [/^\/app\/travel$/, 'nav.travel'],
  [/^\/app\/wellbeing$/, 'nav.wellbeing'],
  [/^\/app$/, 'nav.home'],
  [/^\/command\/incidents\//, 'legacy.incident'],
  [/^\/command\/incidents$/, 'legacy.incidents'],
  [/^\/command\/dispatch$/, 'legacy.dispatch'],
  [/^\/command\/risk-zones$/, 'legacy.riskZones'],
  [/^\/command\/alerts$/, 'legacy.publicAlerts'],
  [/^\/command\/analytics$/, 'legacy.analytics'],
  [/^\/command\/users$/, 'legacy.users'],
  [/^\/command\/units$/, 'legacy.units'],
  [/^\/command\/hospitals$/, 'legacy.hospitals'],
  [/^\/command\/publications$/, 'legacy.publications'],
  [/^\/command\/audit$/, 'legacy.audit'],
  [/^\/command\/scenarios$/, 'legacy.scenarios'],
  [/^\/command\/ai-review$/, 'legacy.aiReview'],
  [/^\/command\/ai$/, 'legacy.aiCenter'],
  [/^\/command\/traffic$/, 'legacy.trafficMonitoring'],
  [/^\/command$/, 'legacy.commandCenter'],
]

function RouteMeta() {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  useEffect(() => {
    const key = routeTitleKeys.find(([pattern]) => pattern.test(pathname))?.[1]
    const product = pathname.startsWith('/command') ? 'PULSE Command' : 'PULSE 911'
    document.title = key ? `${t(key)} — ${product}` : product
  }, [pathname, t])
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
          <Route path="/app/roads" element={<RoadStatusPage />} />
          <Route path="/app/insights" element={<MobilityInsightsPage />} />
          <Route path="/app/nearby" element={<NearbyPage />} />
          <Route path="/app/assistant" element={<PulseAssistantPage />} />
          <Route path="/app/travel" element={<TravelPage />} />
          <Route path="/app/wellbeing" element={<WellbeingPage />} />
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
          <Route path="/command/users" element={<UserManagementPage />} />
          <Route path="/command/units" element={<UnitsPage />} />
          <Route path="/command/hospitals" element={<HospitalsPage />} />
          <Route path="/command/publications" element={<PublicationsAdminPage />} />
          <Route path="/command/audit" element={<AuditPage />} />
          <Route path="/command/scenarios" element={<ScenariosPage />} />
          <Route path="/command/ai" element={<AdminAIPage />} />
          <Route path="/command/ai-review" element={<AIReviewPage />} />
          <Route path="/command/traffic" element={<TrafficMonitorPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </>
}

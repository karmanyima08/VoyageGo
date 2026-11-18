import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/context/AuthContext'
import { AuthModal } from '@/components/auth/AuthModal'
import HomePage from '@/pages/HomePage'
import DestinationsPage from '@/pages/DestinationsPage'
import DestinationDetailPage from '@/pages/DestinationDetailPage'
import PlannerPage from '@/pages/PlannerPage'
import TripResultPage from '@/pages/TripResultPage'
import MyTripsPage from '@/pages/MyTripsPage'
import MLDashboardPage from '@/pages/MLDashboardPage'
import AboutPage from '@/pages/AboutPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" richColors expand toastOptions={{ duration: 4000 }} />
        <AuthModal />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:name" element={<DestinationDetailPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/trips/:id" element={<TripResultPage />} />
          <Route path="/my-trips" element={<MyTripsPage />} />
          <Route path="/ml-dashboard" element={<MLDashboardPage />} />
          <Route path="/how-it-works" element={<Navigate to="/about" replace />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

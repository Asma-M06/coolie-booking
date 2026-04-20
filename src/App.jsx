import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import LoadingScreen from './components/ui/LoadingScreen';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

// Lazy-load all pages for code splitting
const Home               = lazy(() => import('./pages/Home'));
const Login              = lazy(() => import('./pages/Login'));
const Register           = lazy(() => import('./pages/Register'));
const Dashboard          = lazy(() => import('./pages/Dashboard'));
const BookCoolie         = lazy(() => import('./pages/BookCoolie'));
const CoolieListing      = lazy(() => import('./pages/CoolieListing'));
const BookingConfirmation = lazy(() => import('./pages/BookingConfirmation'));
const CoolieRegister      = lazy(() => import('./pages/CoolieRegister'));
const CoolieDashboard     = lazy(() => import('./pages/CoolieDashboard'));
const TrackBooking        = lazy(() => import('./pages/TrackBooking'));

// Layouts
const MainLayout          = lazy(() => import('./components/layout/MainLayout'));
const AdminLayout         = lazy(() => import('./components/layout/AdminLayout'));

// Admin Pages
const AdminLogin          = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard      = lazy(() => import('./pages/AdminDashboard'));
const AdminCoolieRequests = lazy(() => import('./pages/AdminCoolieRequests'));
const AdminCoolieList     = lazy(() => import('./pages/AdminCoolieList'));
const AdminSettings       = lazy(() => import('./pages/AdminSettings'));

// AnimatePresence needs location inside Router
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(249,115,22,0.1)', borderTopColor: '#f97316', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      }>
        <Routes location={location} key={location.pathname}>
          {/* Main Site Routes with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/"                   element={<Home />} />
            <Route path="/login"              element={<Navigate to="/track" replace />} />
            <Route path="/register"           element={<Navigate to="/track" replace />} />
            <Route path="/coolie-register"    element={<Navigate to="/track" replace />} />
            
            {/* Passenger & Guest Routes (No Login Required) */}
            <Route path="/dashboard"          element={<Dashboard />} />
            <Route path="/book"               element={<BookCoolie />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/track"              element={<TrackBooking />} />
            <Route path="/coolies"            element={<CoolieListing />} />

            {/* Coolie Only Routes */}
            <Route path="/coolie-dashboard" element={
              <ProtectedRoute allowedRoles={['coolie']}>
                <CoolieDashboard />
              </ProtectedRoute>
            } />
          </Route>

          {/* Admin Portal (Isolated) */}
          <Route path="/admin/login"        element={<AdminLogin />} />
          <Route path="/admin"              element={<AdminLayout />}>
            <Route path="dashboard"         element={<AdminDashboard />} />
            <Route path="coolie-requests"   element={<AdminCoolieRequests />} />
            <Route path="coolie-list"       element={<AdminCoolieList />} />
            <Route path="settings"          element={<AdminSettings />} />
            <Route index                    element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

// Global Layout imports are now handled within Layout components
// Navbar and Footer are imported in MainLayout.jsx

export default function App() {
  const [appLoading, setAppLoading] = useState(true);

  // Simulate initial app load
  useEffect(() => {
    const t = setTimeout(() => setAppLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <LoadingScreen isVisible={appLoading} />

      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#f1f5fd',
            border: '1px solid rgba(249,115,22,0.2)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#111827' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#111827' } },
        }}
      />
    </>
  );
}
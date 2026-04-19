import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
 
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
 
// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OTPPage from './pages/OTPPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';   // ✅ ADD
import ResetPasswordPage from './pages/ResetPasswordPage';     // ✅ ADD
import GoogleSuccessPage from './pages/GoogleSuccessPage';
 
// User Pages
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import RequestsPage from './pages/RequestsPage';
import BidDetailsPage from './pages/BidDetailsPage';
import BidsPage from './pages/BidsPage';
import ExchangesPage from './pages/ExchangesPage';
import ExchangeDetailPage from './pages/ExchangeDetailPage';
import SchedulePage from './pages/SchedulePage';
import ChatPage from './pages/ChatPage';
import SessionPage from './pages/SessionPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import HistoryPage from './pages/HistoryPage';
 
// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReports from './pages/admin/AdminReports';
 
const Layout = ({ children }) => (
  <div className="min-h-screen bg-slate-50">
    <Navbar />
    <main>{children}</main>
  </div>
);
 
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  borderRadius: '12px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                  fontSize: '14px',
                },
              }}
            />
            <Routes>
              {/* ── Public ── */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-otp" element={<OTPPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />  {/* ✅ FIX */}
              <Route path="/reset-password" element={<ResetPasswordPage />} />    {/* ✅ FIX */}
              <Route path="/auth/google/success" element={<GoogleSuccessPage />} />
 
              {/* ── Protected User ── */}
              <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><Layout><HistoryPage /></Layout></ProtectedRoute>} />
              <Route path="/requests" element={<ProtectedRoute><Layout><RequestsPage /></Layout></ProtectedRoute>} />
              <Route path="/bids" element={<ProtectedRoute><Layout><BidsPage /></Layout></ProtectedRoute>} />
              <Route path="/bids/:id" element={<ProtectedRoute><Layout><BidDetailsPage /></Layout></ProtectedRoute>} />
              <Route path="/exchanges" element={<ProtectedRoute><Layout><ExchangesPage /></Layout></ProtectedRoute>} />
              <Route path="/exchanges/:id" element={<ProtectedRoute><Layout><ExchangeDetailPage /></Layout></ProtectedRoute>} />
              <Route path="/exchanges/:exchangeId/schedule" element={<ProtectedRoute><Layout><SchedulePage /></Layout></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><Layout><ChatPage /></Layout></ProtectedRoute>} />
              <Route path="/session/:roomId" element={<ProtectedRoute><SessionPage /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Layout><ReportsPage /></Layout></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Layout><SettingsPage /></Layout></ProtectedRoute>} />
 
              {/* ── Admin ── */}
              <Route path="/admin" element={<ProtectedRoute adminOnly><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute adminOnly><Layout><AdminUsers /></Layout></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute adminOnly><Layout><AdminReports /></Layout></ProtectedRoute>} />
 
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}
 
export default App;

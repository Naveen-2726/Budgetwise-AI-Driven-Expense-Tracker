import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import VerifyOtp from './pages/Auth/VerifyOtp';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardOverview from './pages/Dashboard/DashboardOverview';
import Transactions from './pages/Dashboard/Transactions';
import Budgets from './pages/Dashboard/Budgets';
import Goals from './pages/Dashboard/Goals';
import AIChat from './pages/Dashboard/AIChat';
import Achievements from './pages/Dashboard/Achievements';
import Settings from './pages/Dashboard/Settings';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirects to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Toaster position="top-right" />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
              <Route path="/verify-otp" element={<VerifyOtp />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<DashboardOverview />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="budgets" element={<Budgets />} />
                <Route path="goals" element={<Goals />} />
                <Route path="achievements" element={<Achievements />} />
                <Route path="ai" element={<AIChat />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
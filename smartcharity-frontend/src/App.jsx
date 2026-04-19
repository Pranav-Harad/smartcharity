import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import NgoBrowse from './pages/NgoBrowse';
import ProtectedRoute from './components/ProtectedRoute';
import Leaderboard from './pages/Leaderboard';
import MissionsPage from './pages/MissionsPage';
import NgoDashboard from './pages/NgoDashboard';
import PlatformAdmin from './pages/PlatformAdmin';
import ImpactFeed from './pages/ImpactFeed';
import ImpactPassport from './pages/ImpactPassport';
import LandingPage from './pages/LandingPage';
import DonateForm from './pages/DonateForm';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Navigate to="/?auth=login" replace />} />
            <Route path="/signup" element={<Navigate to="/?auth=signup" replace />} />
            {}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/ngos" element={<ProtectedRoute><NgoBrowse /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><ImpactPassport /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/missions" element={<ProtectedRoute><MissionsPage /></ProtectedRoute>} />
            <Route path="/ngo-dashboard" element={<ProtectedRoute><NgoDashboard /></ProtectedRoute>} />
            <Route path="/platform-admin" element={<ProtectedRoute><PlatformAdmin /></ProtectedRoute>} />
            <Route path="/feed" element={<ProtectedRoute><ImpactFeed /></ProtectedRoute>} />
            <Route path="/donate/:ngoId" element={<ProtectedRoute><DonateForm /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
export default App;
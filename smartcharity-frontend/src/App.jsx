import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import NgoBrowse from './pages/NgoBrowse';
import DonateForm from './pages/DonateForm';
import ProtectedRoute from './components/ProtectedRoute';
import Leaderboard from './pages/Leaderboard';
import MissionsPage from './pages/MissionsPage';
import NgoDashboard from './pages/NgoDashboard';
import PlatformAdmin from './pages/PlatformAdmin';
import ImpactFeed from './pages/ImpactFeed';
import ImpactPassport from './pages/ImpactPassport'; // Use this for history

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/ngos" element={<ProtectedRoute><NgoBrowse /></ProtectedRoute>} />
            <Route path="/donate/:ngoId" element={<ProtectedRoute><DonateForm /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/missions" element={<ProtectedRoute><MissionsPage /></ProtectedRoute>} />
            <Route path="/ngo-dashboard" element={<ProtectedRoute><NgoDashboard /></ProtectedRoute>} />
            <Route path="/platform-admin" element={<ProtectedRoute><PlatformAdmin /></ProtectedRoute>} />
            <Route path="/feed" element={<ProtectedRoute><ImpactFeed /></ProtectedRoute>} />

            {/* Combined Impact Passport & Donation History */}
            <Route path="/history" element={<ProtectedRoute><ImpactPassport /></ProtectedRoute>} />

            <Route path="/" element={<LoginPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
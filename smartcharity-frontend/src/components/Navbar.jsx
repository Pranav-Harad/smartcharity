import { Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Globe, MessageSquare, ShieldCheck, Trophy, Target } from 'lucide-react';
import { apiFetch } from '../utils/api';
const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [profileName, setProfileName] = useState('');
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    useEffect(() => {
        if (user && user.userId) {
            apiFetch(`/api/users/${user.userId}`)
                .then(data => setProfileName(data.name || ''))
                .catch(err => console.error("Failed to fetch user profile", err));
        }
    }, [user]);
    const getInitials = (name) => {
        if (!name) return '';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };
    const isLanding = location.pathname === '/';
    const isAuth = ['/login', '/signup'].includes(location.pathname);
    if (isAuth) return null;
    return (
        <nav className={`navbar ${isScrolled || !isLanding ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <ShieldCheck className="text-primary" size={28} />
                    <span>Smart<span className="text-gradient">Charity</span></span>
                </Link>
                <div className="navbar-links">
                    {user ? (
                        <>
                            <NavLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                            <NavLink to="/ngos" icon={<Globe size={18} />} label="Browse" />
                            <NavLink to="/feed" icon={<MessageSquare size={18} />} label="Impact" />
                            {user.role === 'USER' && (
                                <>
                                    <NavLink to="/leaderboard" icon={<Trophy size={18} />} label="Leaders" />
                                    <NavLink to="/missions" icon={<Target size={18} />} label="Missions" />
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            {isLanding ? (
                                <>
                                    <a href="#features" className="nav-link">Features</a>
                                    <a href="#about" className="nav-link">About</a>
                                </>
                            ) : (
                                <>
                                    <Link to="/#features" className="nav-link">Features</Link>
                                    <Link to="/#about" className="nav-link">About</Link>
                                </>
                            )}
                        </>
                    )}
                </div>
                <div className="navbar-actions">
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {profileName && (
                                <div style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--primary)',
                                    color: 'var(--dark)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '800',
                                    fontSize: '1rem',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 4px 10px rgba(202, 255, 51, 0.3)',
                                    border: '2px solid rgba(255, 255, 255, 0.1)'
                                }} title={profileName}>
                                    {getInitials(profileName)}
                                </div>
                            )}
                            <button onClick={logout} className="btn-logout">
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/?auth=login" className="nav-link">Login</Link>
                            <Link to="/?auth=signup" className="btn-get-started">Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
const NavLink = ({ to, icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link to={to} className={`nav-link ${isActive ? 'active' : ''}`}>
            {icon}
            <span>{label}</span>
        </Link>
    );
};
export default Navbar;

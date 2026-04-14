import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    // Define paths where the Navbar should NEVER appear
    const authPaths = ['/login', '/signup', '/'];

    // Logic: Hide if user is logged out OR if we are on an auth page
    if (!user || authPaths.includes(location.pathname)) {
        return null;
    }

    return (
        <nav style={styles.nav}>
            <div style={styles.logo}>
                <Link to="/dashboard" style={styles.logoLink}>SmartCharity</Link>
            </div>

            <div style={styles.links}>
                {/* 1. COMMON LINKS */}
                <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                <Link to="/ngos" style={styles.link}>Browse NGOs</Link>
                <Link to="/feed" style={styles.link}>Impact Feed</Link>

                {/* 2. DONOR ONLY */}
                {user.role === 'USER' && (
                    <>
                        <Link to="/history" style={styles.link}>Impact Passport</Link>
                        <Link to="/leaderboard" style={styles.link}>Leaderboard</Link>
                        <Link to="/missions" style={styles.link}>Missions</Link>
                    </>
                )}

                {/* 3. NGO ADMIN */}
                {user.role === 'NGO_ADMIN' && (
                    <Link to="/ngo-dashboard" style={styles.adminLink}>NGO Portal</Link>
                )}

                {/* 4. SUPER ADMIN */}
                {user.role === 'SUPER_ADMIN' && (
                    <Link to="/platform-admin" style={styles.superAdminLink}>Platform Admin</Link>
                )}

                <button onClick={logout} style={styles.logoutBtn}>Logout</button>
            </div>
        </nav>
    );
};

const styles = {
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', background: '#111', borderBottom: '1px solid #333', position: 'sticky', top: 0, zIndex: 1000 },
    logoLink: { fontSize: '1.5rem', fontWeight: 'bold', color: '#4facfe', textDecoration: 'none', letterSpacing: '1px' },
    links: { display: 'flex', alignItems: 'center', gap: '20px' },
    link: { color: '#ccc', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', transition: 'color 0.2s' },
    adminLink: { color: '#fbbf24', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid #fbbf24', padding: '6px 12px', borderRadius: '6px' },
    superAdminLink: { color: '#4facfe', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid #4facfe', padding: '6px 12px', borderRadius: '6px' },
    logoutBtn: { background: '#ef4444', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', marginLeft: '10px' }
};

export default Navbar;
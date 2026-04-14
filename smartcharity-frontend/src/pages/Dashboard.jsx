import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        name: '',
        impactPoints: 0,
        currentStreak: 0,
        earnedBadges: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ROLE REDIRECTION: Don't show the donor dashboard to Admins
        if (user?.role === 'NGO_ADMIN') {
            navigate('/ngo-dashboard');
            return;
        }
        if (user?.role === 'SUPER_ADMIN') {
            navigate('/platform-admin');
            return;
        }

        const fetchUserStats = async () => {
            try {
                const data = await apiFetch(`/api/users/${user.userId}`);
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.userId && user?.role === 'USER') {
            fetchUserStats();
        }
    }, [user, navigate]);

    // If the user isn't a regular donor, don't render anything while redirecting
    if (user?.role !== 'USER') return null;

    if (loading) return <div style={{ color: 'white', padding: '50px', textAlign: 'center' }}>Loading Your Impact Profile...</div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1>Welcome back, <span style={styles.highlight}>{stats.name || 'Hero'}</span></h1>
                <p style={styles.subtitle}>Your Donor Passport Overview</p>
            </header>

            <div style={styles.statsGrid}>
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Impact Points</h3>
                    <p style={styles.pointValue}>{stats.impactPoints}</p>
                    <small style={styles.cardFooter}>Keep donating to level up</small>
                </div>

                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Current Streak</h3>
                    <p style={styles.streakValue}>
                        {stats.currentStreak} Days <span role="img" aria-label="fire">🔥</span>
                    </p>
                    <small style={styles.cardFooter}>Don't let the flame go out!</small>
                </div>
            </div>

            <section style={styles.badgeSection}>
                <h2 style={styles.sectionTitle}>Your Earned Badges</h2>
                <div style={styles.badgeGrid}>
                    {stats.earnedBadges && stats.earnedBadges.length > 0 ? (
                        stats.earnedBadges.map((badge, index) => (
                            <div key={index} style={styles.badgeItem}>
                                <span style={styles.badgeIcon}>{badge === 'CENTURION' ? '🏅' : '🌱'}</span>
                                <span style={styles.badgeName}>{badge}</span>
                            </div>
                        ))
                    ) : (
                        <p style={styles.noData}>No badges earned yet. Start your journey today!</p>
                    )}
                </div>
            </section>
        </div>
    );
};

const styles = {
    container: { padding: '40px', maxWidth: '1000px', margin: '0 auto', color: '#e0e0e0', fontFamily: "'Inter', sans-serif" },
    header: { marginBottom: '40px', borderBottom: '1px solid #333', paddingBottom: '20px' },
    highlight: { color: '#4facfe', textTransform: 'capitalize' },
    subtitle: { color: '#888', fontSize: '1rem' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' },
    card: { background: '#1a1a1a', padding: '30px', borderRadius: '16px', border: '1px solid #333', textAlign: 'center' },
    cardTitle: { fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' },
    pointValue: { fontSize: '3.5rem', fontWeight: '800', color: '#4facfe', margin: '0' },
    streakValue: { fontSize: '3rem', fontWeight: '700', color: '#ff4b2b', margin: '0' },
    cardFooter: { display: 'block', marginTop: '10px', color: '#555', fontSize: '0.8rem' },
    sectionTitle: { fontSize: '1.5rem', marginBottom: '20px', color: '#fff' },
    badgeGrid: { display: 'flex', flexWrap: 'wrap', gap: '15px' },
    badgeItem: { background: 'rgba(79, 172, 254, 0.1)', border: '1px solid #4facfe', padding: '10px 20px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '10px' },
    badgeName: { fontWeight: 'bold', color: '#4facfe', fontSize: '0.9rem' },
    noData: { color: '#555', fontStyle: 'italic' }
};

export default Dashboard;
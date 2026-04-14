import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

const ImpactFeed = () => {
    const [stats, setStats] = useState({
        totalRaised: 0,
        livesTouched: 0,
        activeNgos: 0,
        recentDonations: []
    });

    const fetchFeed = async () => {
        try {
            const data = await apiFetch('/api/feed/global-stats');
            setStats(data);
        } catch (err) {
            console.error("Feed error:", err);
        }
    };

    useEffect(() => {
        fetchFeed();
        // Polling: Update the feed every 60 seconds to keep it "Live"
        const interval = setInterval(fetchFeed, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Global Impact Dashboard</h1>

            {/* Global Stats Bar */}
            <section style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <h2 style={{color: '#4facfe'}}>₹{stats.totalRaised.toLocaleString()}</h2>
                    <p>Total Funds Raised</p>
                </div>
                <div style={styles.statCard}>
                    <h2 style={{color: '#059669'}}>{stats.livesTouched}+</h2>
                    <p>Lives Touched</p>
                </div>
                <div style={styles.statCard}>
                    <h2 style={{color: '#fbbf24'}}>{stats.activeNgos}</h2>
                    <p>Verified NGOs</p>
                </div>
            </section>

            <h3 style={styles.sectionTitle}>Recent Community Activity</h3>

            {/* Live Story Feed */}
            <div style={styles.feedList}>
                {stats.recentDonations.length > 0 ? (
                    stats.recentDonations.map(don => (
                        <div key={don.id} style={styles.feedItem}>
                            <div style={styles.avatar}>🌱</div>
                            <div style={styles.content}>
                                <p><strong>Anonymous Donor</strong> contributed <strong>₹{don.amount}</strong></p>
                                <blockquote style={styles.quote}>
                                    {don.impactStory || "Making the world a better place, one donation at a time."}
                                </blockquote>
                                <small style={{color: '#666'}}>
                                    {new Date(don.timestamp).toLocaleString()}
                                </small>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{textAlign: 'center', color: '#666'}}>No recent activity. Be the first to donate!</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '40px', maxWidth: '900px', margin: '0 auto', color: 'white' },
    title: { textAlign: 'center', marginBottom: '30px', fontWeight: 'bold' },
    sectionTitle: { marginTop: '40px', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
    statCard: { background: '#1a1a1a', padding: '30px', borderRadius: '15px', border: '1px solid #333', textAlign: 'center' },
    feedList: { display: 'flex', flexDirection: 'column', gap: '15px' },
    feedItem: { background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222', display: 'flex', gap: '20px', animation: 'fadeIn 0.5s ease-in' },
    avatar: { fontSize: '1.5rem', background: '#333', minWidth: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    content: { flex: 1 },
    quote: { borderLeft: '3px solid #4facfe', paddingLeft: '15px', margin: '10px 0', fontStyle: 'italic', color: '#ccc', lineHeight: '1.5' }
};

export default ImpactFeed;
import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

const Leaderboard = () => {
    const [topDonors, setTopDonors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                // Correct URL that matches the @GetMapping("/leaderboard")
                const data = await apiFetch('/api/users/leaderboard');
                setTopDonors(data);
            } catch (err) {
                console.error("Leaderboard fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) return <div style={{ color: 'white', padding: '50px' }}>Ranking Heroes...</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Global Impact Leaderboard</h1>
            <div style={styles.list}>
                {topDonors.map((donor, index) => (
                    <div key={donor.id} style={styles.row}>
                        <span style={styles.rank}>#{index + 1}</span>
                        <div style={styles.userInfo}>
                            <span style={styles.userName}>{donor.name}</span>
                            <small style={styles.streak}>{donor.currentStreak} day streak 🔥</small>
                        </div>
                        <span style={styles.points}>{donor.impactPoints} pts</span>
                    </div>
                ))}
                {topDonors.length === 0 && <p style={{color: '#666'}}>No donors on the board yet!</p>}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '40px', maxWidth: '800px', margin: '0 auto', color: 'white' },
    title: { textAlign: 'center', marginBottom: '40px', color: '#4facfe' },
    list: { background: '#111', borderRadius: '15px', border: '1px solid #333', overflow: 'hidden' },
    row: { display: 'flex', alignItems: 'center', padding: '20px', borderBottom: '1px solid #222' },
    rank: { width: '50px', fontWeight: 'bold', color: '#888' },
    userInfo: { flex: 1 },
    userName: { display: 'block', fontSize: '1.1rem', fontWeight: 'bold' },
    streak: { color: '#ff4b2b', fontSize: '0.8rem' },
    points: { fontWeight: 'bold', fontSize: '1.2rem', color: '#4facfe' }
};

export default Leaderboard;
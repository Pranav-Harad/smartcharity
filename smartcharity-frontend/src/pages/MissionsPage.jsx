import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

const MissionsPage = () => {
    const { user } = useContext(AuthContext);
    const [missions, setMissions] = useState([]);

    useEffect(() => {
        const fetchMissions = async () => {
            try {
                const data = await apiFetch('/api/missions');
                setMissions(data);
            } catch (err) {
                console.error("Failed to fetch missions:", err);
            }
        };
        fetchMissions();
    }, []);

    const handleJoin = async (id) => {
        try {
            // Updated to handle the JSON response { "message": "..." }
            const response = await apiFetch(`/api/missions/${id}/join?userId=${user.userId}`, {
                method: 'POST'
            });

            alert(response.message || "Mission Joined!");
            window.location.reload(); // Refresh to update the "Already Joined" button state
        } catch (err) {
            console.error("Join Error:", err);
            alert("Could not join mission. Please try again.");
        }
    };

    return (
        <div style={{ padding: '40px', color: 'white' }}>
            <h1>Active Micro-Missions</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {missions.map(m => {
                    const progress = (m.currentAmount / m.targetAmount) * 100;
                    const hasJoined = m.joinedUserIds.includes(user.userId);

                    return (
                        <div key={m.id} style={styles.card}>
                            <h3>{m.title}</h3>
                            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{m.description}</p>

                            <div style={styles.progressBar}>
                                <div style={{ ...styles.progress, width: `${progress}%` }}></div>
                            </div>

                            <p>Target: <strong>₹{m.targetAmount}</strong></p>
                            <p>Reward: <strong style={{color: '#4facfe'}}>{m.pointBonus} pts</strong></p>

                            <button
                                disabled={hasJoined}
                                onClick={() => handleJoin(m.id)}
                                style={hasJoined ? styles.btnDisabled : styles.btn}
                            >
                                {hasJoined ? "Joined ✓" : "Join Mission"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const styles = {
    card: { background: '#1a1a1a', padding: '20px', borderRadius: '12px', border: '1px solid #333' },
    progressBar: { background: '#333', height: '10px', borderRadius: '5px', margin: '15px 0', overflow: 'hidden' },
    progress: { background: '#4facfe', height: '100%', borderRadius: '5px', transition: 'width 0.3s ease' },
    btn: { background: '#4facfe', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', width: '100%', fontWeight: 'bold' },
    btnDisabled: { background: '#333', color: '#666', border: 'none', padding: '12px', borderRadius: '8px', width: '100%', cursor: 'default' }
};

export default MissionsPage;
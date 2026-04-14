const MissionCard = ({ mission, onJoin, isJoined }) => {
    // Calculate progress percentage for the UI bar [cite: 171]
    const progress = (mission.currentAmount / mission.targetAmount) * 100;

    return (
        <div style={styles.card}>
            <div style={styles.badge}>+{mission.pointBonus} pts</div>
            <h3 style={styles.title}>{mission.title}</h3>
            <p style={styles.desc}>{mission.description}</p>

            <div style={styles.progressContainer}>
                <div style={styles.label}>
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div style={styles.barBackground}>
                    <div style={{ ...styles.barFill, width: `${progress}%` }}></div>
                </div>
                <small style={styles.goal}>Goal: ₹{mission.targetAmount}</small>
            </div>

            <button
                onClick={() => onJoin(mission.id)}
                disabled={isJoined}
                style={isJoined ? styles.btnJoined : styles.btnJoin}
            >
                {isJoined ? "Joined ✓" : "Join Mission"}
            </button>
        </div>
    );
};

const styles = {
    card: { background: '#1a1a1a', padding: '20px', borderRadius: '15px', border: '1px solid #333', position: 'relative' },
    badge: { position: 'absolute', top: '15px', right: '15px', color: '#4facfe', fontWeight: 'bold', fontSize: '0.8rem' },
    title: { color: 'white', margin: '0 0 10px 0' },
    desc: { color: '#888', fontSize: '0.9rem', marginBottom: '20px' },
    progressContainer: { marginBottom: '20px' },
    label: { display: 'flex', justifyContent: 'space-between', color: '#ccc', fontSize: '0.8rem', marginBottom: '5px' },
    barBackground: { background: '#333', height: '8px', borderRadius: '4px', overflow: 'hidden' },
    barFill: { background: '#4facfe', height: '100%', transition: 'width 0.5s ease-in-out' },
    goal: { color: '#555', fontSize: '0.7rem', display: 'block', marginTop: '5px' },
    btnJoin: { width: '100%', padding: '10px', background: '#4facfe', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    btnJoined: { width: '100%', padding: '10px', background: '#333', color: '#888', border: 'none', borderRadius: '8px', cursor: 'default' }
};

export default MissionCard;
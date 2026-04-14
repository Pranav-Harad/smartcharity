const PassportCard = ({ user }) => {
    // Check for id or userId
    const rawId = user.id || user.userId || "";
    const passportId = rawId ? `SC-${rawId.substring(0, 8).toUpperCase()}` : "SC-TEMP";

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <div style={styles.logo}>SmartCharity</div>
                <div style={styles.idTag}>VERIFIED DONOR</div>
            </div>

            <div style={styles.body}>
                <div style={styles.info}>
                    {/* The name should now correctly show "Pranav" */}
                    <h2 style={styles.name}>{user.name || "Donor"}</h2>
                    <p style={styles.label}>PASSPORT ID</p>
                    <code style={styles.value}>{passportId}</code>
                </div>
                <div style={styles.qrPlaceholder}>SC</div>
            </div>

            <div style={styles.stats}>
                <div style={styles.statItem}>
                    <span style={styles.statLabel}>IMPACT POINTS</span>
                    <span style={styles.statValue}>{user.impactPoints || 0}</span>
                </div>
                <div style={styles.statItem}>
                    <span style={styles.statLabel}>STREAK</span>
                    <span style={styles.statValue}>{user.currentStreak || 0} 🔥</span>
                </div>
            </div>
        </div>
    );
};

const styles = {
    card: { width: '350px', background: 'linear-gradient(135deg, #1e1e1e 0%, #111 100%)', borderRadius: '20px', padding: '25px', border: '1px solid #333', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '25px' },
    logo: { color: '#4facfe', fontWeight: 'bold', fontSize: '0.9rem' },
    idTag: { background: '#059669', color: 'white', fontSize: '0.6rem', padding: '2px 8px', borderRadius: '4px' },
    body: { display: 'flex', justifyContent: 'space-between', marginBottom: '25px' },
    name: { margin: 0, fontSize: '1.4rem', color: 'white' },
    label: { color: '#666', fontSize: '0.6rem', margin: '10px 0 2px 0' },
    value: { color: '#aaa', fontSize: '0.8rem', fontFamily: 'monospace' },
    qrPlaceholder: { width: '50px', height: '50px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #333', borderRadius: '8px', color: '#444' },
    stats: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #222', paddingTop: '15px' },
    statItem: { textAlign: 'center' },
    statLabel: { display: 'block', color: '#555', fontSize: '0.6rem', marginBottom: '3px' },
    statValue: { color: 'white', fontWeight: 'bold', fontSize: '1rem' }
};

export default PassportCard;
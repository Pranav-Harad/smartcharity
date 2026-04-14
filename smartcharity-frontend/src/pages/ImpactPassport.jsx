import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { verifyIntegrity } from '../utils/crypto';
import PassportCard from '../components/PassportCard';

const ImpactPassport = () => {
    const { user } = useContext(AuthContext); // Initial user from login
    const [donations, setDonations] = useState([]);
    const [latestProfile, setLatestProfile] = useState(null); // NEW: Fresh profile state
    const [verifying, setVerifying] = useState({});

    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. Fetch fresh user stats (Points, Streak, Name)
                const userData = await apiFetch(`/api/users/${user.userId}`);
                setLatestProfile(userData);

                // 2. Fetch donation history
                const donationData = await apiFetch(`/api/donations/history?userId=${user.userId}`);
                setDonations(donationData);
            } catch (err) {
                console.error("Data fetch failed", err);
            }
        };
        if (user?.userId) loadData();
    }, [user]);

    const handleVerify = async (donation) => {
        setVerifying(prev => ({ ...prev, [donation.id]: 'loading' }));
        const isValid = await verifyIntegrity(donation);
        setVerifying(prev => ({ ...prev, [donation.id]: isValid ? 'valid' : 'invalid' }));
    };

    // Show loading until profile is fetched
    if (!latestProfile) return <div style={{color: 'white', padding: '50px'}}>Loading Passport...</div>;

    return (
        <div style={styles.container}>
            <header style={styles.topSection}>
                {/* PASS THE FRESH PROFILE HERE instead of 'user' */}
                <PassportCard user={latestProfile} />

                <div style={styles.intro}>
                    <h1 style={styles.title}>Impact Passport</h1>
                    <p style={styles.subtitle}>
                        This is your cryptographically verified donor identity.
                        Your ID is: <span style={{color: '#4facfe'}}>SC-{latestProfile.id.substring(0,8).toUpperCase()}</span>
                    </p>
                </div>
            </header>

            <div style={styles.historySection}>
                <h2 style={{ marginBottom: '25px' }}>Verified Audit Log</h2>
                <div style={styles.grid}>
                    {donations.map(d => (
                        <div key={d.id} style={styles.card}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ color: '#4facfe', margin: 0 }}>₹{d.amount} Donation</h3>
                                <button
                                    onClick={() => handleVerify(d)}
                                    style={verifying[d.id] === 'valid' ? styles.btnValid : styles.btnVerify}
                                >
                                    {verifying[d.id] === 'valid' ? '✅ Hash Verified' : '🔍 Verify Integrity'}
                                </button>
                            </div>
                            <p style={{ fontStyle: 'italic', color: '#ccc', margin: '15px 0' }}>"{d.impactStory}"</p>
                            <small style={{ color: '#444', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                SHA-256: {d.auditHash}
                            </small>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '40px', maxWidth: '1100px', margin: '0 auto', color: 'white' },
    topSection: { display: 'flex', gap: '50px', alignItems: 'center', marginBottom: '60px', flexWrap: 'wrap' },
    intro: { flex: 1, minWidth: '300px' },
    title: { fontSize: '2.5rem', marginBottom: '15px', color: 'white' },
    subtitle: { color: '#888', lineHeight: '1.6', fontSize: '1rem' },
    historySection: { borderTop: '1px solid #333', paddingTop: '40px' },
    grid: { display: 'grid', gap: '20px' },
    card: { background: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222' },
    btnVerify: { background: '#222', color: '#aaa', border: '1px solid #333', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' },
    btnValid: { background: '#059669', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', fontSize: '0.8rem' }
};

export default ImpactPassport;
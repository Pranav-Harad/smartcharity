import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { verifyIntegrity } from '../utils/crypto';

const DonationHistory = () => {
    const { user } = useContext(AuthContext);
    const [donations, setDonations] = useState([]);
    const [verifying, setVerifying] = useState({});

    useEffect(() => {
        const fetchHistory = async () => {
            const data = await apiFetch(`/api/donations/history?userId=${user.userId}`);
            setDonations(data);
        };
        fetchHistory();
    }, [user.userId]);

    const handleVerify = async (donation) => {
        setVerifying(prev => ({ ...prev, [donation.id]: 'loading' }));
        const isValid = await verifyIntegrity(donation);
        setVerifying(prev => ({ ...prev, [donation.id]: isValid ? 'valid' : 'invalid' }));
    };

    return (
        <div style={{ padding: '40px', color: 'white' }}>
            <h2>Your Impact Passport</h2>
            <div style={{ display: 'grid', gap: '20px' }}>
                {donations.map(d => (
                    <div key={d.id} style={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ color: '#4facfe' }}>₹{d.amount} Donation</h3>
                            <button
                                onClick={() => handleVerify(d)}
                                style={verifying[d.id] === 'valid' ? styles.btnValid : styles.btnVerify}
                            >
                                {verifying[d.id] === 'valid' ? '✅ Verified' : '🔍 Audit Integrity'}
                            </button>
                        </div>
                        <p style={{ fontStyle: 'italic', color: '#ccc' }}>"{d.impactStory}"</p>
                        <small style={{ color: '#666' }}>Hash: {d.auditHash}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    card: { background: '#1a1a1a', padding: '20px', borderRadius: '12px', border: '1px solid #333' },
    btnVerify: { background: '#333', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' },
    btnValid: { background: '#059669', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }
};

export default DonationHistory;
import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
const PlatformAdmin = () => {
    const [pendingNgos, setPendingNgos] = useState([]);
    const fetchPending = async () => {
        try {
            const data = await apiFetch('/api/ngos/pending'); 
            setPendingNgos(data);
        } catch (err) { console.error("Fetch failed", err); }
    };
    useEffect(() => { fetchPending(); }, []);
    const handleApprove = async (id) => {
        await apiFetch(`/api/ngos/${id}/verify`, { method: 'PATCH' });
        alert("NGO Approved! It is now live for donors.");
        fetchPending();
    };
    return (
        <div style={{ padding: '40px', color: 'white' }}>
            <h1>Platform Management (Super Admin)</h1>
            <div style={styles.tableCard}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.headerRow}>
                            <th>NGO Name</th>
                            <th>Cause</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingNgos.map(ngo => (
                            <tr key={ngo.id} style={styles.row}>
                                <td>{ngo.name}</td>
                                <td>{ngo.cause}</td>
                                <td style={{color: '#fbbf24'}}>Pending Review</td>
                                <td>
                                    <button onClick={() => handleApprove(ngo.id)} style={styles.approveBtn}>Approve</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {pendingNgos.length === 0 && <p style={{padding: '20px'}}>All NGOs are verified!</p>}
            </div>
        </div>
    );
};
const styles = {
    tableCard: { background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    headerRow: { textAlign: 'left', background: '#222', color: '#4facfe' },
    row: { borderBottom: '1px solid #333' },
    approveBtn: { background: '#059669', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }
};
export default PlatformAdmin;
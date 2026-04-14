import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

const NgoDashboard = () => {
    const { user } = useContext(AuthContext);
    const [ngo, setNgo] = useState(null);
    const [report, setReport] = useState("");
    const [summary, setSummary] = useState("");

    // Mission Form State
    const [missionForm, setMissionForm] = useState({
        title: '',
        targetAmount: ''
    });

    useEffect(() => {
        const loadNgo = async () => {
            try {
                // Fetches specific NGO data for the logged-in admin [cite: 52]
                const data = await apiFetch(`/api/ngos/admin/${user.userId}`);
                setNgo(data);
            } catch (err) {
                console.error("Failed to load NGO profile:", err);
            }
        };
        if (user?.userId) loadNgo();
    }, [user]);

    // AI Handler: Uses Gemini to simplify impact reports [cite: 30, 35]
    const handleSimplify = async () => {
        try {
            const data = await apiFetch('/api/ai/simplify-report', {
                method: 'POST',
                body: JSON.stringify({ reportText: report })
            });
            // Extracts the "summary" field from the JSON response
            setSummary(data.summary);
        } catch (err) {
            console.error("AI Error:", err);
            alert("Could not simplify report. Check backend logs.");
        }
    };

    // Mission Handler: Creates a new collective giving goal [cite: 31, 52]
    const handleLaunchMission = async () => {
        if (!ngo) return;
        try {
            await apiFetch('/api/missions', {
                method: 'POST',
                body: JSON.stringify({
                    title: missionForm.title,
                    targetAmount: parseFloat(missionForm.targetAmount),
                    ngoId: ngo.id
                })
            });
            alert("Micro-Mission Launched! Donors can now join.");
            // Reset form after success
            setMissionForm({ title: '', targetAmount: '' });
        } catch (err) {
            alert("Failed to launch mission: " + err.message);
        }
    };

    if (!ngo) return <div style={{color: 'white', padding: '50px'}}>Loading NGO Profile...</div>;

    return (
        <div style={{ padding: '40px', color: 'white', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1>Welcome, {ngo.name} Admin</h1>
                <p>Status: {ngo.verified ? "✅ Verified" : "⏳ Awaiting Super Admin Approval"}</p>
            </header>

            <div style={styles.grid}>
                {/* 1. Analytics Section: Visualizes total funds raised [cite: 33] */}
                <div style={styles.card}>
                    <h3>Analytics</h3>
                    <div style={styles.statBox}>
                        <small>Total Funds Raised</small>
                        <h2 style={{color: '#059669'}}>₹{ngo.totalFundsReceived.toLocaleString()}</h2>
                    </div>
                </div>

                {/* 2. Micro-Mission Creator: Sets up new community challenges [cite: 31] */}
                <div style={styles.card}>
                    <h3>Create Micro-Mission</h3>
                    <input
                        style={styles.input}
                        placeholder="Mission Title (e.g. Feed 50 people)"
                        value={missionForm.title}
                        onChange={(e) => setMissionForm({...missionForm, title: e.target.value})}
                    />
                    <input
                        style={styles.input}
                        type="number"
                        placeholder="Goal Amount (₹)"
                        value={missionForm.targetAmount}
                        onChange={(e) => setMissionForm({...missionForm, targetAmount: e.target.value})}
                    />
                    <button onClick={handleLaunchMission} style={styles.btnBlue}>Launch Mission</button>
                </div>

                {/* 3. AI Report Simplifier: Converts tech reports to donor bullets [cite: 30, 35] */}
                <div style={{ ...styles.card, gridColumn: 'span 2' }}>
                    <h3>Impact Report Simplifier (Gemini AI)</h3>
                    <textarea
                        style={styles.textarea}
                        placeholder="Paste your monthly impact data here..."
                        value={report}
                        onChange={(e) => setReport(e.target.value)}
                    />
                    <button onClick={handleSimplify} style={styles.btnBlue}>Simplify for Donors</button>

                    {summary && (
                        <div style={styles.summaryBox}>
                            <h4 style={{color: '#4facfe', marginBottom: '10px'}}>AI-Generated Summary:</h4>
                            <pre style={{whiteSpace: 'pre-wrap', color: '#ccc', fontFamily: 'inherit'}}>
                                {summary}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    card: { background: '#1a1a1a', padding: '25px', borderRadius: '15px', border: '1px solid #333' },
    statBox: { background: '#000', padding: '20px', borderRadius: '10px', marginTop: '10px', textAlign: 'center' },
    input: { width: '100%', padding: '12px', marginBottom: '10px', background: '#000', border: '1px solid #444', color: 'white', borderRadius: '8px' },
    textarea: { width: '100%', height: '120px', background: '#000', color: 'white', marginBottom: '10px', padding: '10px', borderRadius: '8px', border: '1px solid #444' },
    btnBlue: { width: '100%', background: '#4facfe', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    summaryBox: { marginTop: '20px', padding: '15px', borderLeft: '4px solid #4facfe', background: '#222', borderRadius: '4px' }
};

export default NgoDashboard;
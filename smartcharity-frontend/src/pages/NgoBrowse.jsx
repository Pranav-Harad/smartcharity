import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const NgoBrowse = () => {
    const [ngos, setNgos] = useState([]);
    const [selectedCause, setSelectedCause] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const causes = ['All', 'Education', 'Environment', 'Food', 'Medical', 'Animal Welfare'];

    useEffect(() => {
        const fetchNgos = async () => {
            try {
                // Calls the new search endpoint
                const endpoint = selectedCause === 'All'
                    ? '/api/ngos'
                    : `/api/ngos/search?cause=${selectedCause.toLowerCase()}`;
                const data = await apiFetch(endpoint);
                setNgos(data);
            } catch (err) {
                console.error("Failed to load NGOs", err);
            }
        };
        fetchNgos();
    }, [selectedCause]);

    // Local filtering for the search bar (filtering by name)
    const filteredNgos = ngos.filter(ngo =>
        ngo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>Explore Verified Causes</h2>
                <div style={styles.filterBar}>
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search by NGO name..."
                        style={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {/* Category Filter */}
                    <select
                        style={styles.select}
                        value={selectedCause}
                        onChange={(e) => setSelectedCause(e.target.value)}
                    >
                        {causes.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <div style={styles.grid}>
                {filteredNgos.length > 0 ? (
                    filteredNgos.map(ngo => (
                        <div key={ngo.id} style={styles.card}>
                            <div style={styles.badge}>{ngo.cause}</div>
                            <h3 style={styles.ngoName}>{ngo.name}</h3>
                            <p style={styles.desc}>{ngo.description}</p>
                            <div style={styles.footer}>
                                <span style={styles.funds}>₹{ngo.totalFundsReceived} Raised</span>
                                <button
                                    style={styles.btn}
                                    onClick={() => navigate(`/donate/${ngo.id}`)}
                                >
                                    Donate
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ color: '#666' }}>No NGOs found matching your criteria.</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '40px', maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '30px' },
    title: { color: 'white', marginBottom: '20px' },
    filterBar: { display: 'flex', gap: '15px' },
    searchInput: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#1a1a1a', color: 'white' },
    select: { padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#1a1a1a', color: 'white' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
    card: { background: '#1a1a1a', padding: '25px', borderRadius: '15px', border: '1px solid #333', position: 'relative' },
    badge: { position: 'absolute', top: '15px', right: '15px', background: '#4facfe33', color: '#4facfe', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', textTransform: 'uppercase' },
    ngoName: { color: 'white', marginTop: '10px' },
    desc: { color: '#888', fontSize: '0.9rem', height: '60px', overflow: 'hidden' },
    footer: { marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    funds: { color: '#059669', fontWeight: 'bold', fontSize: '0.9rem' },
    btn: { background: '#4facfe', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};

export default NgoBrowse;
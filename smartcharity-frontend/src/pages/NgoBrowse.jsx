import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ShieldCheck, HeartHandshake, ArrowRight, Activity } from 'lucide-react';
const NgoBrowse = () => {
    const [ngos, setNgos] = useState([]);
    const [selectedCause, setSelectedCause] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const causes = ['All', 'Education', 'Environment', 'Food', 'Medical', 'Animal Welfare'];
    useEffect(() => {
        const fetchNgos = async () => {
            setLoading(true);
            try {
                const endpoint = selectedCause === 'All'
                    ? '/api/ngos'
                    : `/api/ngos/search?cause=${selectedCause.toLowerCase()}`;
                const data = await apiFetch(endpoint);
                setNgos(data);
            } catch (err) {
                console.error("Failed to load NGOs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNgos();
    }, [selectedCause]);
    const filteredNgos = ngos.filter(ngo =>
        ngo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div className="main-content" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
            <motion.div 
                className="container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--white)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
                        Explore <span className="text-primary">Verified Causes</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        Browse our network of transparent NGOs. Every donation is cryptographically verified on-chain.
                    </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
                    {}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ position: 'relative', flex: '1', minWidth: '300px', maxWidth: '500px' }}>
                            <Search style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                            <input
                                type="text"
                                placeholder="Search NGOs by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1.2rem 1rem 1.2rem 3.5rem',
                                    borderRadius: '100px',
                                    background: 'var(--glass-bg)',
                                    border: '1px solid var(--border-glass)',
                                    color: 'var(--white)',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.3s',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                }}
                                onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 4px rgba(202, 255, 51, 0.1)'; }}
                                onBlur={(e) => { e.target.style.borderColor = 'var(--border-glass)'; e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)'; }}
                            />
                        </div>
                    </div>
                    {}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '0.5rem', color: 'var(--text-muted)' }}>
                            <Filter size={16} />
                            <span style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filter:</span>
                        </div>
                        {causes.map(cause => (
                            <button
                                key={cause}
                                onClick={() => setSelectedCause(cause)}
                                style={{
                                    padding: '0.6rem 1.5rem',
                                    borderRadius: '100px',
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    background: selectedCause === cause ? 'var(--primary)' : 'rgba(255, 255, 255, 0.03)',
                                    color: selectedCause === cause ? 'var(--dark)' : 'var(--text-muted)',
                                    border: `1px solid ${selectedCause === cause ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: selectedCause === cause ? '0 4px 15px rgba(202, 255, 51, 0.3)' : 'none'
                                }}
                                onMouseEnter={(e) => { if(selectedCause !== cause) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                                onMouseLeave={(e) => { if(selectedCause !== cause) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; }}
                            >
                                {cause}
                            </button>
                        ))}
                    </div>
                </div>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                            <ShieldCheck size={48} className="text-primary" />
                        </motion.div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
                        {filteredNgos.length > 0 ? (
                            filteredNgos.map((ngo, index) => (
                                <motion.div 
                                    key={ngo.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    whileHover={{ y: -5 }}
                                    className="liquid-glass"
                                    style={{ padding: '2.5rem', borderRadius: '2rem', position: 'relative', display: 'flex', flexDirection: 'column' }}
                                >
                                    <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(202, 255, 51, 0.1)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid rgba(202, 255, 51, 0.3)' }}>
                                        {ngo.cause}
                                    </div>
                                    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '55px', height: '55px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <HeartHandshake size={28} />
                                        </div>
                                        <h3 style={{ color: 'var(--white)', fontSize: '1.4rem', fontWeight: '800', paddingRight: '5rem', lineHeight: '1.2' }}>{ngo.name}</h3>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2.5rem', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                        {ngo.description}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.2rem', letterSpacing: '0.05em' }}>Total Raised</div>
                                            <div style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '1.2rem' }}>₹{ngo.totalFundsReceived}</div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/donate/${ngo.id}`)}
                                            style={{
                                                background: 'var(--white)',
                                                color: 'var(--dark)',
                                                border: 'none',
                                                padding: '0.8rem 1.5rem',
                                                borderRadius: '100px',
                                                cursor: 'pointer',
                                                fontWeight: '800',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                transition: 'all 0.2s',
                                                boxShadow: '0 4px 15px rgba(255,255,255,0.15)'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(202, 255, 51, 0.4)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(255,255,255,0.15)'; }}
                                        >
                                            Donate <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '2rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                <Activity size={48} style={{ opacity: 0.2, margin: '0 auto 1rem', color: 'var(--white)' }} />
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: '500' }}>No NGOs found matching your search criteria.</p>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};
export default NgoBrowse;
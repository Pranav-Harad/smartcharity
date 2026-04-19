import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { motion } from 'framer-motion';
import { Globe, Heart, ShieldCheck, Zap, Activity, MessageSquare } from 'lucide-react';
const ImpactFeed = () => {
    const [stats, setStats] = useState({
        totalRaised: 0,
        livesTouched: 0,
        activeNgos: 0,
        recentDonations: []
    });
    const [loading, setLoading] = useState(true);
    const fetchFeed = async () => {
        try {
            const data = await apiFetch('/api/feed/global-stats');
            setStats(data);
        } catch (err) {
            console.error("Feed error:", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchFeed();
        const interval = setInterval(fetchFeed, 60000);
        return () => clearInterval(interval);
    }, []);
    if (loading) {
        return (
            <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <motion.div 
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                    <ShieldCheck size={48} className="text-primary" />
                </motion.div>
            </div>
        );
    }
    return (
        <div className="main-content" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
            <motion.div 
                className="container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
                        Global <span className="text-primary">Impact Feed</span>
                    </h1>
                    <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        Real-time transparency into how your contributions are changing lives around the world.
                    </p>
                </div>
                {}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="liquid-glass" 
                        style={{ padding: '2.5rem', borderRadius: '2rem', textAlign: 'center' }}
                    >
                        <Zap color="var(--primary)" size={32} style={{ marginBottom: '1rem' }} />
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)' }}>
                            ₹{stats.totalRaised.toLocaleString()}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>Total Funds Raised</p>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="liquid-glass" 
                        style={{ padding: '2.5rem', borderRadius: '2rem', textAlign: 'center' }}
                    >
                        <Heart color="#ff4b2b" size={32} style={{ marginBottom: '1rem' }} />
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--white)' }}>
                            {stats.livesTouched}+
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>Lives Touched</p>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="liquid-glass" 
                        style={{ padding: '2.5rem', borderRadius: '2rem', textAlign: 'center' }}
                    >
                        <Globe color="#4facfe" size={32} style={{ marginBottom: '1rem' }} />
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--white)' }}>
                            {stats.activeNgos}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>Verified NGOs</p>
                    </motion.div>
                </div>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--white)', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Activity className="text-primary" size={28} />
                        Recent Community Activity
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {stats.recentDonations.length > 0 ? (
                            stats.recentDonations.map((don, index) => (
                                <motion.div 
                                    key={don.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 + (index * 0.1) }}
                                    className="glass"
                                    style={{ padding: '2rem', borderRadius: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}
                                >
                                    <div style={{ 
                                        minWidth: '50px', 
                                        height: '50px', 
                                        borderRadius: '50%', 
                                        background: 'rgba(255,255,255,0.05)', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        fontSize: '1.2rem',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        👤
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                                            <p style={{ color: 'var(--white)', fontWeight: '700', fontSize: '1.1rem' }}>
                                                Anonymous Donor <span style={{ color: 'var(--text-muted)', fontWeight: '400', fontSize: '0.9rem', marginLeft: '0.5rem' }}>contributed</span> <span className="text-primary">₹{don.amount}</span>
                                            </p>
                                            <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                {new Date(don.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </small>
                                        </div>
                                        <div style={{ 
                                            background: 'rgba(202, 255, 51, 0.03)', 
                                            padding: '1rem 1.5rem', 
                                            borderRadius: '1rem', 
                                            borderLeft: '4px solid var(--primary)',
                                            color: 'var(--text-muted)',
                                            fontStyle: 'italic',
                                            lineHeight: '1.6',
                                            display: 'flex',
                                            gap: '0.75rem'
                                        }}>
                                            <MessageSquare size={16} style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                                            <span>{don.impactStory || "Making the world a better place, one donation at a time."}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '2rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No recent activity. Be the first to donate!</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
export default ImpactFeed;
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { motion } from 'framer-motion';
import { Flame, Zap, Award, Activity, TrendingUp, ShieldCheck } from 'lucide-react';
const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        name: '',
        impactPoints: 0,
        currentStreak: 0,
        earnedBadges: []
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (user?.role === 'NGO_ADMIN') {
            navigate('/ngo-dashboard');
            return;
        }
        if (user?.role === 'SUPER_ADMIN') {
            navigate('/platform-admin');
            return;
        }
        const fetchUserStats = async () => {
            try {
                const data = await apiFetch(`/api/users/${user.userId}`);
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            } finally {
                setLoading(false);
            }
        };
        if (user?.userId && user?.role === 'USER') {
            fetchUserStats();
        } else if (!user?.userId) {
            setLoading(false); 
        }
    }, [user, navigate]);
    if (user?.role !== 'USER') return null;
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
                key="dashboard-container-fade"
                className="container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            >
                {}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    style={{ marginBottom: '3rem' }}
                >
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                        Welcome back, <span className="text-primary">{stats?.name || 'Hero'}</span>
                    </h1>
                    <p className="text-muted" style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                        Here is your impact passport and global contribution status.
                    </p>
                </motion.div>
                {}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                    {}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="liquid-glass" 
                        style={{ padding: '2.5rem', borderRadius: '2rem', position: 'relative', overflow: 'hidden' }}
                    >
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05 }}>
                            <Zap size={150} color="var(--primary)" />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(202, 255, 51, 0.1)', borderRadius: '1rem', color: 'var(--primary)' }}>
                                <TrendingUp size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--white)' }}>Impact Points</h3>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', position: 'relative', zIndex: 1 }}>
                            <span style={{ fontSize: '4.5rem', fontWeight: '900', lineHeight: 1, color: 'var(--primary)', textShadow: '0 0 20px rgba(202, 255, 51, 0.3)' }}>
                                {stats?.impactPoints || 0}
                            </span>
                            <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>pts</span>
                        </div>
                        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', position: 'relative', zIndex: 1 }}>
                            Rank up by funding verified missions.
                        </p>
                    </motion.div>
                    {}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="liquid-glass" 
                        style={{ padding: '2.5rem', borderRadius: '2rem', position: 'relative', overflow: 'hidden' }}
                    >
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05 }}>
                            <Flame size={150} color="#ff4b2b" />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(255, 75, 43, 0.1)', borderRadius: '1rem', color: '#ff4b2b' }}>
                                <Activity size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--white)' }}>Current Streak</h3>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', position: 'relative', zIndex: 1 }}>
                            <span style={{ fontSize: '4.5rem', fontWeight: '900', lineHeight: 1, color: '#ff4b2b', textShadow: '0 0 20px rgba(255, 75, 43, 0.3)' }}>
                                {stats?.currentStreak || 0}
                            </span>
                            <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>days</span>
                        </div>
                        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', position: 'relative', zIndex: 1 }}>
                            Don't let the flame go out! Donate within 30 days.
                        </p>
                    </motion.div>
                </div>
                {}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="glass" 
                    style={{ padding: '3rem', borderRadius: '2rem' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--white)' }}>
                                <Award color="var(--primary)" size={28} />
                                Earned Badges
                            </h2>
                            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Your verified impact achievements.</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        {stats?.earnedBadges && stats.earnedBadges.length > 0 ? (
                            stats.earnedBadges.map((badge, index) => (
                                <motion.div 
                                    key={index}
                                    whileHover={{ y: -5, scale: 1.05 }}
                                    style={{ 
                                        padding: '0.75rem 1.5rem', 
                                        background: 'linear-gradient(135deg, rgba(202, 255, 51, 0.1) 0%, rgba(202, 255, 51, 0.02) 100%)', 
                                        border: '1px solid rgba(202, 255, 51, 0.2)', 
                                        borderRadius: '100px', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '0.75rem',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    <span style={{ fontSize: '1.25rem' }}>{badge === 'CENTURION' ? '🏅' : '🌱'}</span>
                                    <span style={{ fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.05em' }}>{badge}</span>
                                </motion.div>
                            ))
                        ) : (
                            <div style={{ padding: '2.5rem', width: '100%', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '1.5rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                <Award size={48} style={{ opacity: 0.2, margin: '0 auto 1rem', color: 'var(--white)' }} />
                                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '1.1rem' }}>No badges earned yet. Complete your first mission to unlock rewards!</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};
export default Dashboard;
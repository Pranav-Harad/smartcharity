import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { motion } from 'framer-motion';
import { Target, Users, Award, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
const MissionsPage = () => {
    const { user } = useContext(AuthContext);
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchMissions = async () => {
            try {
                const data = await apiFetch('/api/missions');
                setMissions(data);
            } catch (err) {
                console.error("Failed to fetch missions:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMissions();
    }, []);
    const handleJoin = async (id) => {
        try {
            const response = await apiFetch(`/api/missions/${id}/join?userId=${user.userId}`, {
                method: 'POST'
            });
            alert(response.message || "Mission Joined!");
            window.location.reload(); 
        } catch (err) {
            console.error("Join Error:", err);
            alert("Could not join mission. Please try again.");
        }
    };
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
                        Active <span className="text-primary">Micro-Missions</span>
                    </h1>
                    <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        Join collective giving goals to unlock massive impact bonuses and exclusive digital badges.
                    </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
                    {missions.map((m, index) => {
                        const progress = Math.min((m.currentAmount / m.targetAmount) * 100, 100);
                        const hasJoined = m.joinedUserIds.includes(user.userId);
                        return (
                            <motion.div 
                                key={m.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="liquid-glass"
                                style={{ padding: '2.5rem', borderRadius: '2rem', display: 'flex', flexDirection: 'column' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ 
                                        width: '50px', 
                                        height: '50px', 
                                        borderRadius: '14px', 
                                        background: 'rgba(202, 255, 51, 0.1)', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        color: 'var(--primary)',
                                        border: '1px solid rgba(202, 255, 51, 0.2)'
                                    }}>
                                        <Target size={24} />
                                    </div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--white)' }}>{m.title}</h3>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem', flex: 1 }}>
                                    {m.description || "Join this collective effort to create lasting change for those in need."}
                                </p>
                                <div style={{ marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: '700' }}>
                                        <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>Progress</span>
                                        <span className="text-primary">{Math.round(progress)}%</span>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.05)', height: '10px', borderRadius: '100px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            style={{ 
                                                height: '100%', 
                                                background: 'linear-gradient(90deg, var(--primary) 0%, #a3e635 100%)',
                                                boxShadow: '0 0 15px rgba(202, 255, 51, 0.4)'
                                            }} 
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.9rem' }}>
                                        <span style={{ color: 'var(--white)', fontWeight: '700' }}>₹{m.currentAmount.toLocaleString()}</span>
                                        <span style={{ color: 'var(--text-muted)' }}>of ₹{m.targetAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1.25rem', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ flex: 1, textAlign: 'center' }}>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.25rem' }}>Reward</p>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: '800' }}>
                                            <Zap size={14} />
                                            <span>{m.pointBonus} pts</span>
                                        </div>
                                    </div>
                                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                                    <div style={{ flex: 1, textAlign: 'center' }}>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.25rem' }}>Participants</p>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--white)', fontWeight: '800' }}>
                                            <Users size={14} />
                                            <span>{m.joinedUserIds.length}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    disabled={hasJoined}
                                    onClick={() => handleJoin(m.id)}
                                    className={hasJoined ? "" : "btn-get-started"}
                                    style={hasJoined ? { 
                                        width: '100%', 
                                        padding: '1rem', 
                                        borderRadius: '100px', 
                                        background: 'rgba(255,255,255,0.05)', 
                                        color: 'var(--text-muted)', 
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        fontWeight: '800',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    } : { 
                                        width: '100%', 
                                        padding: '1rem',
                                        borderRadius: '100px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    {hasJoined ? (
                                        <>Mission Joined <Award size={18} /></>
                                    ) : (
                                        <>Join Mission <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};
export default MissionsPage;
import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { motion } from 'framer-motion';
import { Trophy, Flame, User, ShieldCheck, Crown, Medal } from 'lucide-react';
const Leaderboard = () => {
    const [topDonors, setTopDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const data = await apiFetch('/api/users/leaderboard');
                setTopDonors(data);
            } catch (err) {
                console.error("Leaderboard fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
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
                style={{ maxWidth: '800px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
                        Global <span className="text-primary">Leaderboard</span>
                    </h1>
                    <p className="text-muted" style={{ fontSize: '1.2rem', margin: '0 auto' }}>
                        Recognizing our top contributors and their legendary streaks.
                    </p>
                </div>
                <div className="glass" style={{ borderRadius: '2rem', overflow: 'hidden', padding: '1rem' }}>
                    <div style={{ display: 'flex', padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        <span style={{ width: '80px' }}>Rank</span>
                        <span style={{ flex: 1 }}>Donor</span>
                        <span style={{ width: '120px', textAlign: 'right' }}>Impact Points</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {topDonors.length > 0 ? (
                            topDonors.map((donor, index) => {
                                const isTop3 = index < 3;
                                const colors = ['#FFD700', '#C0C0C0', '#CD7F32']; 
                                return (
                                    <motion.div 
                                        key={donor.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 + (index * 0.05) }}
                                        whileHover={{ background: 'rgba(255,255,255,0.02)' }}
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            padding: '1.5rem 2rem', 
                                            borderBottom: index === topDonors.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ width: '80px', display: 'flex', alignItems: 'center' }}>
                                            {index === 0 ? (
                                                <Crown size={24} color={colors[0]} />
                                            ) : isTop3 ? (
                                                <Medal size={24} color={colors[index]} />
                                            ) : (
                                                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-muted)', paddingLeft: '0.5rem' }}>#{index + 1}</span>
                                            )}
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                            <div style={{ 
                                                width: '45px', 
                                                height: '45px', 
                                                borderRadius: '12px', 
                                                background: isTop3 ? `rgba(${isTop3 ? '202, 255, 51' : '255,255,255'}, 0.1)` : 'rgba(255,255,255,0.05)', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                border: `1px solid ${isTop3 ? 'rgba(202, 255, 51, 0.2)' : 'rgba(255,255,255,0.1)'}`
                                            }}>
                                                <User size={20} className={isTop3 ? "text-primary" : ""} />
                                            </div>
                                            <div>
                                                <p style={{ color: 'var(--white)', fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.2rem' }}>{donor.name}</p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Flame size={14} color="#ff4b2b" />
                                                    <span style={{ color: '#ff4b2b', fontSize: '0.8rem', fontWeight: '700' }}>{donor.currentStreak} day streak</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ width: '120px', textAlign: 'right' }}>
                                            <span style={{ 
                                                fontSize: '1.3rem', 
                                                fontWeight: '900', 
                                                color: isTop3 ? 'var(--primary)' : 'var(--white)',
                                                textShadow: isTop3 ? '0 0 15px rgba(202, 255, 51, 0.3)' : 'none'
                                            }}>
                                                {donor.impactPoints.toLocaleString()}
                                            </span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '700', marginLeft: '0.4rem', textTransform: 'uppercase' }}>pts</span>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div style={{ textAlign: 'center', padding: '4rem' }}>
                                <Trophy size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No donors on the board yet!</p>
                            </div>
                        )}
                    </div>
                </div>
                <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(202, 255, 51, 0.05)', padding: '0.75rem 1.5rem', borderRadius: '100px', border: '1px solid rgba(202, 255, 51, 0.1)' }}>
                        <Trophy className="text-primary" size={18} />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Rank up by funding verified missions and keeping your streak alive!</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
export default Leaderboard;
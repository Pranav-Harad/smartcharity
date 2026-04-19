import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
const DonateForm = () => {
    const { ngoId } = useParams();
    const { user } = useContext(AuthContext);
    const [amount, setAmount] = useState(100);
    const [loading, setLoading] = useState(false);
    const [ngoDetails, setNgoDetails] = useState(null);
    const [success, setSuccess] = useState(false);
    const [impactStory, setImpactStory] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchNgoDetails = async () => {
            try {
                const data = await apiFetch(`/api/ngos/${ngoId}`);
                setNgoDetails(data);
            } catch(e) {
                console.error("Failed to fetch NGO details");
            }
        };
        fetchNgoDetails();
    }, [ngoId]);
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);
    const handleDonate = async () => {
        if (amount < 10) {
            alert("Minimum donation is ₹10");
            return;
        }
        setLoading(true);
        try {
            const donationData = {
                userId: user.userId,
                ngoId: ngoId,
                amount: Number(amount),
                status: "PENDING"
            };
            const result = await apiFetch('/api/donations', {
                method: 'POST',
                body: JSON.stringify(donationData)
            });
            setImpactStory(result.impactStory || "Your donation is making a real difference.");
            setSuccess(true);
        } catch (err) {
            alert("Donation failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };
    if (success) {
        return (
            <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="liquid-glass"
                    style={{ padding: '4rem 3rem', borderRadius: '2rem', textAlign: 'center', maxWidth: '600px' }}
                >
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        style={{ display: 'inline-flex', background: 'rgba(202, 255, 51, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '2rem', color: 'var(--primary)' }}
                    >
                        <CheckCircle2 size={64} />
                    </motion.div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--white)', marginBottom: '1rem' }}>Impact Verified!</h2>
                    <p style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem' }}>₹{amount} Donated</p>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontStyle: 'italic', lineHeight: '1.6' }}>"{impactStory}"</p>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>Redirecting to dashboard...</p>
                </motion.div>
            </div>
        );
    }
    return (
        <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="liquid-glass"
                style={{ width: '100%', maxWidth: '500px', padding: '3rem', borderRadius: '2rem', position: 'relative', overflow: 'hidden' }}
            >
                {}
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.05, transform: 'rotate(15deg)' }}>
                    <Heart size={200} color="var(--primary)" />
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(202, 255, 51, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--white)', lineHeight: '1.2' }}>Secure Donation</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{ngoDetails ? `To ${ngoDetails.name}` : 'Loading recipient...'}</p>
                        </div>
                    </div>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                            Donation Amount (INR)
                        </label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.5rem', color: 'var(--white)', fontWeight: '800' }}>₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '1rem',
                                    padding: '1.25rem 1.25rem 1.25rem 3rem',
                                    color: 'var(--primary)',
                                    fontSize: '2rem',
                                    fontWeight: '900',
                                    outline: 'none',
                                    transition: 'all 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                            />
                        </div>
                        {}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            {[100, 500, 1000, 5000].map(preset => (
                                <button
                                    key={preset}
                                    onClick={() => setAmount(preset)}
                                    style={{
                                        flex: 1,
                                        padding: '0.5rem',
                                        background: Number(amount) === preset ? 'rgba(202, 255, 51, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                        border: `1px solid ${Number(amount) === preset ? 'var(--primary)' : 'transparent'}`,
                                        color: Number(amount) === preset ? 'var(--primary)' : 'var(--text-muted)',
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        fontWeight: '700',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    ₹{preset}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '0.5rem', border: '1px dashed rgba(255,255,255,0.1)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ShieldCheck size={16} color="var(--primary)" />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Verified by smart contract • 100% transparent</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                            onClick={() => navigate(-1)}
                            style={{ flex: 1, padding: '1rem', background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', color: 'var(--white)', borderRadius: '100px', fontWeight: '800', cursor: 'pointer', transition: 'background 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleDonate} 
                            disabled={loading || !amount || amount <= 0}
                            className="btn-get-started"
                            style={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: (loading || !amount || amount <= 0) ? 0.7 : 1 }}
                        >
                            {loading ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                    <ShieldCheck size={20} />
                                </motion.div>
                            ) : (
                                <>Donate Now <ArrowRight size={18} /></>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
export default DonateForm;
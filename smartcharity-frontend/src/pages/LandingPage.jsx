import { useState, useContext, useEffect } from 'react';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cpu, Fingerprint, Award, TrendingUp, ArrowRight, CheckCircle2, Star, Sparkles, X } from 'lucide-react';
import heroNewBg from '../assets/hero_new.png';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
const LandingPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login } = useContext(AuthContext);
    const authType = searchParams.get('auth');
    const viewType = searchParams.get('view');
    const [isExiting, setIsExiting] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [signupData, setSignupData] = useState({ name: '', email: '', password: '', role: 'USER' });
    const [topDonors, setTopDonors] = useState([]);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
    useEffect(() => {
        if (viewType === 'leaderboard') {
            fetchLeaderboard();
        }
    }, [viewType]);
    const fetchLeaderboard = async () => {
        setLoadingLeaderboard(true);
        try {
            const data = await apiFetch('/api/users/leaderboard');
            setTopDonors(data);
        } catch (err) {
            console.error("Leaderboard fetch failed:", err);
        } finally {
            setLoadingLeaderboard(false);
        }
    };
    const closeModals = () => setSearchParams({});
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(loginData),
            });
            login(data);
            closeModals();
            setTimeout(() => {
                setIsExiting(true);
                setTimeout(() => navigate('/dashboard'), 800);
            }, 1200);
        } catch (err) {
            alert("Login Failed: " + err.message);
        }
    };
    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const data = await apiFetch('/api/auth/signup', {
                method: 'POST',
                body: JSON.stringify(signupData),
            });
            login(data);
            closeModals();
            setTimeout(() => {
                setIsExiting(true);
                setTimeout(() => navigate('/dashboard'), 800);
            }, 600);
        } catch (err) {
            alert("Signup Failed: " + err.message);
        }
    };
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: (i = 0) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.8, ease: "easeOut" }
        })
    };
    useEffect(() => {
        if (location.hash) {
            const element = document.querySelector(location.hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location.hash]);
    return (
        <div className="main-content">
            {}
            <motion.section 
                className="hero-section" 
                animate={isExiting ? { y: '-100%', opacity: 0 } : { y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                style={{ 
                    backgroundColor: 'white',
                    backgroundImage: `linear-gradient(to bottom, white 0%, rgba(255, 255, 255, 0) 150px), url(${heroNewBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 50px',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="container hero-container">
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="hero-top-content"
                        style={{ marginTop: '3rem' }}
                    >
                        <h1 className="hero-title text-white" style={{ fontWeight: '900' }}>
                            Smart<span style={{ color: 'var(--primary)', textShadow: '0 0 20px rgba(202, 255, 51, 0.4)' }}>Charity</span>
                        </h1>
                        <h2 className="text-white" style={{ fontSize: '2.5rem', fontWeight: '700', marginTop: '0.75rem', letterSpacing: '-0.03em', maxWidth: '1000px', color: 'white' }}>
                            Empowering Impact Through Verified Solutions
                        </h2>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="hero-split"
                    >
                        {}
                        <div className="liquid-glass" style={{ padding: '1.5rem', borderRadius: '2rem', maxWidth: '350px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1.25rem', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', marginLeft: '-5rem', marginTop: '-4rem' }}>
                            <p className="hero-description text-dark" style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500', textAlign: 'left' }}>
                                From verified donations to real-world impact, we deliver innovative technologies that elevate transparency and trust. Let's create something exceptional together.
                            </p>
                        </div>
                        {}
                        <div className="liquid-glass" style={{ padding: '1rem 2.5rem', borderRadius: '100px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1.5rem', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', marginTop: '8rem' }}>
                            {!user && (
                                <button 
                                    onClick={() => setSearchParams({ auth: 'signup' })}
                                    style={{ 
                                        width: '220px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#1df52f', 
                                        color: 'var(--dark)', 
                                        padding: '1.1rem 0', 
                                        borderRadius: '50px', 
                                        fontWeight: '800', 
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.6), inset -2px -2px 0 rgba(0,0,0,0.2), 0 4px 10px rgba(29, 245, 47, 0.3)',
                                        border: '1px solid rgba(0,0,0,0.1)',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    Become Member
                                </button>
                            )}
                            <button 
                                onClick={() => user ? navigate('/leaderboard') : setSearchParams({ auth: 'login' })}
                                style={{ 
                                    width: user ? '350px' : '220px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#ffffff', 
                                    color: 'var(--dark)', 
                                    padding: '1.1rem 0', 
                                    borderRadius: '50px', 
                                    fontWeight: '800', 
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.6), inset -2px -2px 0 rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.1)',
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                See Leaderboard
                            </button>
                        </div>
                        {}
                        <div style={{ minWidth: '350px' }}></div>
                    </motion.div>
                </div>
            </motion.section>
            {}
            <section className="stats-bar">
                <div className="container">
                    <div className="stats-grid">
                        <StatItem value="2000+" label="Verified NGOs" />
                        <StatItem value="10+" label="Years Exp." />
                        <StatItem value="800+" label="Hours of Audit" />
                        <StatItem value="150M+" label="In Tracked Funds" />
                    </div>
                </div>
            </section>
            {}
            <section id="features" className="section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">
                            Our <span style={{ color: 'var(--primary)' }}>Features</span>
                        </h2>
                        <p className="section-desc">
                            We offer a range of AI-driven and cryptographic tools designed to help your donations stand out and make real impact.
                        </p>
                    </div>
                    <div className="feature-grid">
                        <FeatureCard 
                            icon={<Cpu size={32} />}
                            title="AI Summaries"
                            description="Gemini AI processes complex NGO audit reports into simple, transparent impact stories anyone can understand."
                        />
                        <FeatureCard 
                            icon={<Fingerprint size={32} />}
                            title="Cryptographic Proof"
                            description="Every transaction is hashed using SHA-256. You get a unique digital fingerprint proving exactly where your money went."
                        />
                        <FeatureCard 
                            icon={<Award size={32} />}
                            title="Impact Passport"
                            description="Earn unique digital badges, track your giving streaks, and build a verified profile of your global contributions."
                        />
                    </div>
                </div>
            </section>
            {}
            <section id="about" className="section section-alt">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">How it Works</h2>
                        <p className="section-desc">
                            Transparent giving made simple. Follow these steps to start making an impact.
                        </p>
                    </div>
                    <div className="step-list centered-steps">
                        <Step number="1" title="Choose a Cause" text="Browse through hundreds of verified NGOs across the globe, sorted by real impact metrics." />
                        <Step number="2" title="One-Click Donation" text="Donate securely using your preferred method. Your transaction is instantly hashed." />
                        <Step number="3" title="Track Live Audit" text="Watch the funds hit the NGO's audited account and receive an AI-generated impact report." />
                    </div>
                </div>
            </section>
            {}
            <footer className="footer" style={{ borderTop: '1px solid var(--border-glass)' }}>
                <div className="container">
                    <div className="footer-content">
                        <div className="navbar-brand text-primary">
                            <ShieldCheck size={24} />
                            <span style={{ color: 'var(--white)' }}>SmartCharity</span>
                        </div>
                        <div className="footer-links">
                            <a href="#">Privacy</a>
                            <a href="#">Audit Logs</a>
                            <a href="#">API</a>
                        </div>
                        <p className="footer-copy">&copy; 2026 SmartCharity Platform</p>
                    </div>
                </div>
            </footer>
            {}
            <AnimatePresence>
                {authType && (
                    <div className="modal-overlay" onClick={closeModals}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ 
                                scale: 0.2, 
                                y: -500, 
                                opacity: 0, 
                                transition: { duration: 0.6, ease: "circIn" } 
                            }}
                            className="auth-modal"
                            onClick={(e) => e.stopPropagation()}
                            style={{ 
                                padding: '3rem', 
                                borderRadius: '2.5rem', 
                                width: '100%', 
                                maxWidth: '450px',
                                backgroundColor: 'white',
                                border: '1px solid rgba(0, 0, 0, 0.05)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                            }}
                        >
                            <button className="modal-close" onClick={closeModals}>
                                <X size={24} />
                            </button>
                            {authType === 'login' ? (
                                <div className="auth-content">
                                    <h2 className="text-dark" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Welcome Back</h2>
                                    <p className="text-dark" style={{ opacity: 0.7, marginBottom: '2rem' }}>Login to manage your impact.</p>
                                    <form className="auth-form" onSubmit={handleLogin}>
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            className="auth-input"
                                            value={loginData.email}
                                            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                                            required
                                        />
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            className="auth-input"
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                            required
                                        />
                                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', borderRadius: '12px' }}>
                                            Login
                                        </button>
                                    </form>
                                    <p className="auth-switch text-dark" style={{ marginTop: '1.5rem', opacity: 0.8 }}>
                                        Don't have an account? <span onClick={() => setSearchParams({ auth: 'signup' })} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '700' }}>Sign up</span>
                                    </p>
                                </div>
                            ) : (
                                <div className="auth-content">
                                    <h2 className="text-dark" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Join the Impact</h2>
                                    <p className="text-dark" style={{ opacity: 0.7, marginBottom: '2rem' }}>Start your journey as a donor or an NGO.</p>
                                    <form className="auth-form" onSubmit={handleSignup}>
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            className="auth-input"
                                            value={signupData.name}
                                            onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                                            required
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            className="auth-input"
                                            value={signupData.email}
                                            onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                                            required
                                        />
                                        <input
                                            type="password"
                                            placeholder="Create Password"
                                            className="auth-input"
                                            value={signupData.password}
                                            onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                                            required
                                        />
                                        <select 
                                            className="auth-input"
                                            value={signupData.role}
                                            onChange={(e) => setSignupData({...signupData, role: e.target.value})}
                                            style={{ appearance: 'none' }}
                                        >
                                            <option value="USER">I am a Donor</option>
                                            <option value="NGO_ADMIN">I represent an NGO</option>
                                        </select>
                                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', borderRadius: '12px' }}>
                                            Create Account
                                        </button>
                                    </form>
                                    <p className="auth-switch text-dark" style={{ marginTop: '1.5rem', opacity: 0.8 }}>
                                        Already have an account? <span onClick={() => setSearchParams({ auth: 'login' })} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '700' }}>Login here</span>
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {}
            <AnimatePresence>
                {viewType === 'leaderboard' && (
                    <div className="modal-overlay" onClick={closeModals}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, y: -100, transition: { duration: 0.4, ease: "easeIn" } }}
                            className="liquid-glass"
                            onClick={(e) => e.stopPropagation()}
                            style={{ 
                                padding: '3rem', 
                                borderRadius: '2.5rem', 
                                width: '100%', 
                                maxWidth: '600px',
                                backdropFilter: 'blur(30px)',
                                WebkitBackdropFilter: 'blur(30px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                                color: 'white'
                            }}
                        >
                            <button className="modal-close" onClick={closeModals} style={{ color: 'white' }}>
                                <X size={24} />
                            </button>
                            <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem', textAlign: 'center' }}>
                                Global <span style={{ color: 'var(--primary)' }}>Leaderboard</span>
                            </h2>
                            <p style={{ opacity: 0.7, marginBottom: '2rem', textAlign: 'center' }}>The top heroes driving verified impact.</p>
                            {loadingLeaderboard ? (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <p>Ranking Heroes...</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                    {topDonors.map((donor, index) => (
                                        <div key={donor.id} style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            padding: '1.25rem', 
                                            background: 'rgba(255,255,255,0.05)', 
                                            borderRadius: '1.25rem',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            <span style={{ width: '40px', fontWeight: '800', color: index < 3 ? 'var(--primary)' : 'rgba(255,255,255,0.5)', fontSize: '1.25rem' }}>
                                                #{index + 1}
                                            </span>
                                            <div style={{ flex: 1 }}>
                                                <span style={{ display: 'block', fontWeight: '700', fontSize: '1.1rem' }}>{donor.name}</span>
                                                <small style={{ color: '#ff4b2b', fontWeight: '600' }}>{donor.currentStreak} day streak 🔥</small>
                                            </div>
                                            <span style={{ fontWeight: '900', fontSize: '1.2rem', color: 'var(--primary)' }}>
                                                {donor.impactPoints} <small style={{ fontWeight: '400', fontSize: '0.8rem' }}>pts</small>
                                            </span>
                                        </div>
                                    ))}
                                    {topDonors.length === 0 && <p style={{ textAlign: 'center', opacity: 0.5 }}>No donors on the board yet!</p>}
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
const StatItem = ({ value, label }) => (
    <div className="stat-item">
        <p className="stat-value text-gradient">{value}</p>
        <p className="stat-label">{label}</p>
    </div>
);
const FeatureCard = ({ icon, title, description }) => (
    <motion.div 
        whileHover={{ y: -10 }}
        className="feature-card"
    >
        <div className="feature-icon-wrapper">
            {icon}
        </div>
        <h3 className="feature-title">{title}</h3>
        <p className="feature-text">{description}</p>
    </motion.div>
);
const Step = ({ number, title, text }) => (
    <div className="step-item">
        <div className="step-num">{number}</div>
        <div className="step-content">
            <h4>{title}</h4>
            <p>{text}</p>
        </div>
    </div>
);
export default LandingPage;
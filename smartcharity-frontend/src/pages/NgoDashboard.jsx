import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    Target, 
    Zap, 
    BarChart3, 
    PlusCircle, 
    CheckCircle2, 
    AlertCircle, 
    Users, 
    TrendingUp,
    MessageSquare,
    Sparkles,
    ArrowUpRight,
    Loader2,
    Edit,
    ChevronDown,
    DollarSign,
    X,
    Activity
} from 'lucide-react';
const NgoDashboard = () => {
    const { user } = useContext(AuthContext);
    const [ngo, setNgo] = useState(null);
    const [missions, setMissions] = useState([]);
    const [report, setReport] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSimplifying, setIsSimplifying] = useState(false);
    const [ngoForm, setNgoForm] = useState({
        name: '',
        description: '',
        cause: 'Education',
        mainGoal: ''
    });
    const [isRegistering, setIsRegistering] = useState(false);
    const [missionForm, setMissionForm] = useState({
        title: '',
        description: '',
        targetAmount: ''
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isInsightsOpen, setIsInsightsOpen] = useState(false);
    const [isSupportersOpen, setIsSupportersOpen] = useState(false);
    const [supportersList, setSupportersList] = useState([]);
    const [isCauseOpen, setIsCauseOpen] = useState(false);
    const causeOptions = ["Education", "Medical", "Environment", "Food & Hunger", "Animal Welfare", "Other"];
    useEffect(() => {
        const loadNgoData = async () => {
            try {
                const data = await apiFetch(`/api/ngos/admin/${user.userId}`);
                setNgo(data);
                const allMissions = await apiFetch('/api/missions');
                setMissions(allMissions.filter(m => m.ngoId === data.id));
            } catch (err) {
                console.error("Failed to load NGO profile:", err);
            } finally {
                setLoading(false);
            }
        };
        if (user?.userId) loadNgoData();
    }, [user]);
    const handleSimplify = async () => {
        if (!report) return;
        setIsSimplifying(true);
        try {
            const data = await apiFetch('/api/ai/simplify-report', {
                method: 'POST',
                body: JSON.stringify({ reportText: report })
            });
            setSummary(data.summary);
        } catch (err) {
            console.error("AI Error:", err);
        } finally {
            setIsSimplifying(false);
        }
    };
    const handleLaunchMission = async () => {
        if (!ngo || !missionForm.title || !missionForm.targetAmount) return;
        try {
            const newMission = await apiFetch('/api/missions', {
                method: 'POST',
                body: JSON.stringify({
                    title: missionForm.title,
                    description: missionForm.description,
                    targetAmount: parseFloat(missionForm.targetAmount),
                    ngoId: ngo.id
                })
            });
            setMissions([newMission, ...missions]);
            setMissionForm({ title: '', description: '', targetAmount: '' });
            alert("Micro-Mission Launched! Donors can now join.");
        } catch (err) {
            alert("Failed to launch mission: " + err.message);
        }
    };
    const handleRegisterNgo = async (e) => {
        e.preventDefault();
        setIsRegistering(true);
        try {
            const newNgo = await apiFetch('/api/ngos', {
                method: 'POST',
                body: JSON.stringify({
                    name: ngoForm.name,
                    description: ngoForm.description,
                    cause: ngoForm.cause,
                    mainGoal: parseFloat(ngoForm.mainGoal) || 0,
                    adminUserId: user.userId
                })
            });
            setNgo(newNgo);
        } catch (err) {
            alert("Failed to register NGO: " + err.message);
        } finally {
            setIsRegistering(false);
        }
    };
    const handleEditNgo = async (e) => {
        e.preventDefault();
        try {
            const updatedNgo = await apiFetch(`/api/ngos/${ngo.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: ngoForm.name,
                    description: ngoForm.description,
                    cause: ngoForm.cause,
                    mainGoal: parseFloat(ngoForm.mainGoal) || 0
                })
            });
            setNgo(updatedNgo);
            setIsEditModalOpen(false);
        } catch (err) {
            alert("Failed to update NGO: " + err.message);
        }
    };
    const handleSimulateFunds = async (missionId) => {
        const amount = prompt("Enter amount to add to this mission (Simulated):", "1000");
        if (!amount || isNaN(amount)) return;
        try {
            const updatedMission = await apiFetch(`/api/missions/${missionId}/fund`, {
                method: 'POST',
                body: JSON.stringify({ amount: parseFloat(amount) })
            });
            setMissions(missions.map(m => m.id === missionId ? updatedMission : m));
            setNgo({...ngo, totalFundsReceived: ngo.totalFundsReceived + parseFloat(amount)});
        } catch (err) {
            alert("Failed to add funds: " + err.message);
        }
    };
    const handleViewSupporters = async () => {
        try {
            const supporters = await apiFetch(`/api/donations/ngo/${ngo.id}/supporters`);
            setSupportersList(supporters);
            setIsSupportersOpen(true);
        } catch (err) {
            alert("Failed to load supporters: " + err.message);
        }
    };
    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <Loader2 size={48} color="var(--primary)" className="animate-spin" />
            </div>
        );
    }
    if (!ngo) {
        return (
            <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem', display: 'flex', justifyContent: 'center' }}>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-dark" 
                    style={{ padding: '3rem', borderRadius: '2rem', maxWidth: '600px', width: '100%' }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(202, 255, 51, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
                            <PlusCircle size={48} className="text-primary" />
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem' }}>Create Your NGO Profile</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Set up your organization to start creating micro-missions and receiving funds.</p>
                    </div>
                    <form onSubmit={handleRegisterNgo} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>NGO Name</label>
                            <input
                                required
                                style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1rem', color: 'white', outline: 'none' }}
                                placeholder="e.g. Green Earth Foundation"
                                value={ngoForm.name}
                                onChange={(e) => setNgoForm({...ngoForm, name: e.target.value})}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Topic / Cause</label>
                            <div 
                                onClick={() => setIsCauseOpen(!isCauseOpen)}
                                style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1rem', color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <span>{ngoForm.cause}</span>
                                <ChevronDown size={16} style={{ transition: 'transform 0.2s', transform: isCauseOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                            </div>
                            <AnimatePresence>
                                {isCauseOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', marginTop: '0.5rem', zIndex: 50, overflow: 'hidden' }}
                                    >
                                        {causeOptions.map(option => (
                                            <div 
                                                key={option}
                                                onClick={() => { setNgoForm({...ngoForm, cause: option}); setIsCauseOpen(false); }}
                                                style={{ padding: '0.75rem 1rem', cursor: 'pointer', transition: 'background 0.2s', background: ngoForm.cause === option ? 'rgba(202, 255, 51, 0.1)' : 'transparent', color: ngoForm.cause === option ? 'var(--primary)' : 'white' }}
                                                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                                onMouseLeave={(e) => e.target.style.background = ngoForm.cause === option ? 'rgba(202, 255, 51, 0.1)' : 'transparent'}
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Overall Funding Goal (₹)</label>
                            <input
                                required
                                type="number"
                                style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1rem', color: 'white', outline: 'none' }}
                                placeholder="e.g. 500000"
                                value={ngoForm.mainGoal}
                                onChange={(e) => setNgoForm({...ngoForm, mainGoal: e.target.value})}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Description</label>
                            <textarea
                                required
                                style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1rem', color: 'white', outline: 'none', height: '120px', resize: 'none' }}
                                placeholder="Briefly describe your NGO's primary mission..."
                                value={ngoForm.description}
                                onChange={(e) => setNgoForm({...ngoForm, description: e.target.value})}
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={isRegistering}
                            className="btn-primary"
                            style={{ width: '100%', padding: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                        >
                            {isRegistering ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                            Create NGO Profile
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }
    return (
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
            {}
            <header style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}
                    >
                        <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(202, 255, 51, 0.1)', color: 'var(--primary)', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle2 size={12} />
                            Admin Console
                        </span>
                        {ngo.verified && (
                            <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle2 size={12} />
                                Verified NGO
                            </span>
                        )}
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', letterSpacing: '-0.02em', margin: 0, display: 'flex', alignItems: 'center' }}
                    >
                        Welcome, <span className="text-primary" style={{ marginLeft: '0.5rem' }}>{ngo.name}</span>
                        <button 
                            onClick={() => {
                                setNgoForm({ name: ngo.name, description: ngo.description, cause: ngo.cause || 'Education', mainGoal: ngo.mainGoal || '' });
                                setIsEditModalOpen(true);
                            }}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '1rem', display: 'flex', alignItems: 'center' }}
                            title="Edit Profile"
                        >
                            <Edit size={24} style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'} />
                        </button>
                    </motion.h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1.1rem' }}>Manage your impact, missions, and transparency reports.</p>
                </div>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ display: 'flex', gap: '1rem' }}
                >
                    <button 
                        onClick={handleViewSupporters}
                        className="btn-outline-light" 
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Users size={18} />
                        Supporters
                    </button>
                    <button 
                        onClick={() => setIsInsightsOpen(true)}
                        className="btn-primary" 
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 20px rgba(202, 255, 51, 0.2)' }}
                    >
                        <TrendingUp size={18} />
                        Insights
                    </button>
                </motion.div>
            </header>
            {}
            {ngo.mainGoal > 0 && (
                <div className="glass-dark" style={{ padding: '2rem', borderRadius: '2rem', marginBottom: '2rem', border: '1px solid rgba(202, 255, 51, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '0.25rem' }}>NGO Overarching Goal</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total funds raised towards the primary mission</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary)' }}>₹{ngo.totalFundsReceived.toLocaleString()}</span>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>/ ₹{ngo.mainGoal.toLocaleString()}</span>
                        </div>
                    </div>
                    <div style={{ height: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (ngo.totalFundsReceived / ngo.mainGoal) * 100)}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            style={{ 
                                height: '100%', 
                                backgroundColor: 'var(--primary)',
                                boxShadow: '0 0 15px rgba(202, 255, 51, 0.4)',
                                position: 'relative'
                            }}
                        />
                        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '900', color: (ngo.totalFundsReceived / ngo.mainGoal) > 0.5 ? '#111827' : 'white', mixBlendMode: 'difference' }}>
                            {Math.round(Math.min(100, (ngo.totalFundsReceived / ngo.mainGoal) * 100))}% Completed
                        </span>
                    </div>
                </div>
            )}
            {}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <StatCard 
                    icon={<BarChart3 color="#60a5fa" />} 
                    label="Total Funds" 
                    value={`₹${ngo.totalFundsReceived.toLocaleString()}`}
                    trend="+12% from last month"
                />
                <StatCard 
                    icon={<Target color="var(--primary)" />} 
                    label="Active Missions" 
                    value={missions.length}
                    trend={`${missions.filter(m => (m.currentAmount/m.targetAmount) > 0.8).length} nearing goal`}
                />
                <StatCard 
                    icon={<Users color="#c084fc" />} 
                    label="Supporters" 
                    value="1.2k"
                    trend="+45 new today"
                />
                <StatCard 
                    icon={<Sparkles color="#fb923c" />} 
                    label="Trust Score" 
                    value="98"
                    trend="Top 5% on Platform"
                />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
                {}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', gridColumn: 'span 2' }}>
                    {}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="glass-dark"
                        style={{ padding: '2rem', borderRadius: '2rem', position: 'relative', overflow: 'hidden' }}
                    >
                        <div style={{ position: 'absolute', top: '0', right: '0', padding: '2rem', opacity: 0.1 }}>
                            <PlusCircle size={100} color="var(--primary)" />
                        </div>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <PlusCircle className="text-primary" />
                                Launch New Micro-Mission
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginLeft: '0.25rem' }}>Mission Title</label>
                                    <input
                                        style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1rem', color: 'white', outline: 'none' }}
                                        placeholder="e.g. Solar Lamps for Village"
                                        value={missionForm.title}
                                        onChange={(e) => setMissionForm({...missionForm, title: e.target.value})}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginLeft: '0.25rem' }}>Target Goal (₹)</label>
                                    <input
                                        style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1rem', color: 'white', outline: 'none' }}
                                        type="number"
                                        placeholder="50,000"
                                        value={missionForm.targetAmount}
                                        onChange={(e) => setMissionForm({...missionForm, targetAmount: e.target.value})}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginLeft: '0.25rem' }}>Brief Description</label>
                                    <textarea
                                        style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1rem', color: 'white', outline: 'none', height: '100px', resize: 'none' }}
                                        placeholder="What impact will this mission create?"
                                        value={missionForm.description}
                                        onChange={(e) => setMissionForm({...missionForm, description: e.target.value})}
                                    />
                                </div>
                            </div>
                            <button 
                                onClick={handleLaunchMission}
                                className="btn-primary"
                                style={{ width: '100%', padding: '1rem' }}
                            >
                                Start Mission Now
                            </button>
                        </div>
                    </motion.div>
                    {}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Target className="text-primary" />
                                Active Missions
                            </h3>
                            <button style={{ background: 'none', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                                View All <ArrowUpRight size={16} />
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {missions.length > 0 ? (
                                missions.map((m, idx) => (
                                    <MissionStatusCard key={m.id || idx} mission={m} onSimulateFunds={handleSimulateFunds} />
                                ))
                            ) : (
                                <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '2rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                    <p style={{ color: 'var(--text-muted)' }}>No active missions found. Launch one to start raising funds!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {}
                    <div className="glass-dark" style={{ padding: '2rem', borderRadius: '2.5rem', border: '1px solid rgba(202, 255, 51, 0.2)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '8rem', height: '8rem', background: 'rgba(202, 255, 51, 0.1)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Sparkles className="text-primary" />
                                Impact Lab
                            </h3>
                            <span style={{ padding: '0.25rem 0.5rem', background: 'var(--primary)', color: 'var(--dark)', fontSize: '0.65rem', fontWeight: '900', borderRadius: '4px', textTransform: 'uppercase' }}>AI Power</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            Paste your technical impact data or complex reports. Gemini AI will simplify them into donor-friendly highlights.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <textarea
                                style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.25rem', padding: '1rem', color: 'white', outline: 'none', height: '180px', resize: 'none', fontSize: '0.85rem' }}
                                placeholder="Paste monthly data here (e.g. 'Project A served 50 families...')"
                                value={report}
                                onChange={(e) => setReport(e.target.value)}
                            />
                            <button 
                                onClick={handleSimplify}
                                disabled={isSimplifying || !report}
                                style={{ 
                                    width: '100%', 
                                    padding: '1rem', 
                                    borderRadius: '1.25rem', 
                                    fontWeight: 'bold', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    gap: '0.5rem',
                                    transition: 'all 0.3s',
                                    backgroundColor: isSimplifying || !report ? '#1f2937' : 'white',
                                    color: isSimplifying || !report ? '#6b7280' : 'black',
                                    border: 'none',
                                    cursor: isSimplifying || !report ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isSimplifying ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    <Zap size={18} />
                                )}
                                Simplify for Donors
                            </button>
                            <AnimatePresence>
                                {summary && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        style={{ background: 'rgba(202, 255, 51, 0.05)', border: '1px solid rgba(202, 255, 51, 0.2)', padding: '1.5rem', borderRadius: '1.25rem', marginTop: '1rem' }}
                                    >
                                        <h4 style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <MessageSquare size={14} />
                                            AI Summary
                                        </h4>
                                        <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.6', fontStyle: 'italic', margin: 0 }}>
                                            "{summary}"
                                        </p>
                                        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '1rem', cursor: 'pointer' }}>
                                            Publish to Impact Feed
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    {}
                    <div className="glass-dark" style={{ padding: '2rem', borderRadius: '2.5rem' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Zap color="#facc15" size={18} />
                            Platform Tips
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <li style={{ display: 'flex', gap: '0.5rem' }}>
                                <span style={{ color: 'var(--primary)' }}>•</span>
                                Missions under ₹20,000 get funded 3x faster.
                            </li>
                            <li style={{ display: 'flex', gap: '0.5rem' }}>
                                <span style={{ color: 'var(--primary)' }}>•</span>
                                Update your impact report weekly to stay top-ranked.
                            </li>
                            <li style={{ display: 'flex', gap: '0.5rem' }}>
                                <span style={{ color: 'var(--primary)' }}>•</span>
                                Verified NGOs get a 2.5% platform fee waiver.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            {}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-dark"
                            style={{ padding: '2rem', borderRadius: '2rem', maxWidth: '500px', width: '100%', position: 'relative' }}
                        >
                            <button onClick={() => setIsEditModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                <X size={24} className="hover:text-white transition-colors" />
                            </button>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Edit Public Profile</h2>
                            <form onSubmit={handleEditNgo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>NGO Name</label>
                                    <input required style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1rem', color: 'white', outline: 'none' }} value={ngoForm.name} onChange={(e) => setNgoForm({...ngoForm, name: e.target.value})} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Topic / Cause</label>
                                    <div onClick={() => setIsCauseOpen(!isCauseOpen)} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1rem', color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>{ngoForm.cause}</span>
                                        <ChevronDown size={16} />
                                    </div>
                                    <AnimatePresence>
                                        {isCauseOpen && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', marginTop: '0.5rem', zIndex: 150, overflow: 'hidden' }}>
                                                {causeOptions.map(option => (
                                                    <div key={option} onClick={() => { setNgoForm({...ngoForm, cause: option}); setIsCauseOpen(false); }} style={{ padding: '0.75rem 1rem', cursor: 'pointer', background: ngoForm.cause === option ? 'rgba(202, 255, 51, 0.1)' : 'transparent', color: ngoForm.cause === option ? 'var(--primary)' : 'white' }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.target.style.background = ngoForm.cause === option ? 'rgba(202, 255, 51, 0.1)' : 'transparent'}>{option}</div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Overall Funding Goal (₹)</label>
                                    <input required type="number" style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1rem', color: 'white', outline: 'none' }} value={ngoForm.mainGoal} onChange={(e) => setNgoForm({...ngoForm, mainGoal: e.target.value})} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Description</label>
                                    <textarea required style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1rem', color: 'white', outline: 'none', height: '100px', resize: 'none' }} value={ngoForm.description} onChange={(e) => setNgoForm({...ngoForm, description: e.target.value})} />
                                </div>
                                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}>Save Changes</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {}
            <AnimatePresence>
                {isInsightsOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-dark"
                            style={{ padding: '2.5rem', borderRadius: '2rem', maxWidth: '600px', width: '100%', position: 'relative', textAlign: 'center' }}
                        >
                            <button onClick={() => setIsInsightsOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                <X size={24} className="hover:text-white transition-colors" />
                            </button>
                            <div style={{ display: 'inline-flex', padding: '1.5rem', background: 'rgba(202, 255, 51, 0.1)', borderRadius: '50%', marginBottom: '1.5rem' }}>
                                <Activity size={48} color="var(--primary)" />
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem' }}>Deep Insights</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Advanced analytics are being generated by the platform. Check back soon for donor retention rates and AI-driven campaign suggestions.</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', textAlign: 'left' }}>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg. Donation</span>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹1,450</h3>
                                    <span style={{ color: '#22c55e', fontSize: '0.7rem' }}>+5% this week</span>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Donor Retention</span>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>78%</h3>
                                    <span style={{ color: '#22c55e', fontSize: '0.7rem' }}>Highly engaged</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {}
            <AnimatePresence>
                {isSupportersOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-dark"
                            style={{ padding: '2rem', borderRadius: '2rem', maxWidth: '500px', width: '100%', position: 'relative', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
                        >
                            <button onClick={() => setIsSupportersOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                <X size={24} className="hover:text-white transition-colors" />
                            </button>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Users className="text-primary" size={24} /> 
                                Our Supporters
                            </h2>
                            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {supportersList.length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No supporters yet. Keep sharing your missions!</p>
                                ) : (
                                    supportersList.map((supporter, idx) => (
                                        <div key={supporter.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{supporter.donorName}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    {new Date(supporter.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--primary)' }}>
                                                ₹{supporter.amount.toLocaleString()}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
const StatCard = ({ icon, label, value, trend }) => (
    <motion.div 
        whileHover={{ scale: 1.02 }}
        className="glass-dark"
        style={{ padding: '1.5rem', borderRadius: '2rem' }}
    >
        <div style={{ width: '3rem', height: '3rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            {icon}
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{label}</p>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: '0 0 0.25rem 0' }}>{value}</h2>
        <p style={{ color: '#22c55e', fontSize: '0.65rem', fontWeight: 'bold', margin: 0 }}>{trend}</p>
    </motion.div>
);
const MissionStatusCard = ({ mission, onSimulateFunds }) => {
    const progress = Math.min(100, (mission.currentAmount / mission.targetAmount) * 100);
    const isReached = progress >= 100;
    return (
        <motion.div 
            whileHover={{ scale: 1.01 }}
            style={{ background: 'rgba(0,0,0,0.4)', border: isReached ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '2rem', position: 'relative', overflow: 'hidden' }}
        >
            {isReached && (
                <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary)', color: 'var(--dark)', padding: '0.35rem 1rem', borderBottomLeftRadius: '1rem', fontSize: '0.7rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={14} /> Goal Reached
                </div>
            )}
            <h4 style={{ fontWeight: 'bold', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: isReached ? '6rem' : '0' }}>{mission.title}</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{mission.description || "Raising funds for essential community support."}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount Raised</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: '900', color: isReached ? 'var(--primary)' : 'white' }}>₹{mission.currentAmount.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Goal</span>
                        <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>₹{mission.targetAmount.toLocaleString()}</span>
                    </div>
                </div>
                <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: isReached ? 'var(--primary)' : 'var(--text-main)' }}>
                            {Math.round(progress)}% Completed
                        </span>
                    </div>
                    <div style={{ height: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            style={{ 
                                height: '100%', 
                                backgroundColor: isReached ? '#22c55e' : 'var(--primary)',
                                boxShadow: isReached ? '0 0 10px rgba(34, 197, 94, 0.5)' : '0 0 10px rgba(202, 255, 51, 0.3)'
                            }}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '0.65rem', color: '#6b7280' }}>
                        {isReached ? 'Mission Accomplished' : 'In Progress'}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {!isReached && (
                            <button 
                                onClick={() => onSimulateFunds && onSimulateFunds(mission.id)}
                                style={{ background: 'rgba(202, 255, 51, 0.1)', border: '1px solid rgba(202, 255, 51, 0.2)', padding: '0.5rem 0.75rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--primary)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                            >
                                <DollarSign size={12} /> Add Funds
                            </button>
                        )}
                        <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 'bold', color: 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
                            Manage
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
export default NgoDashboard;

import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <header style={styles.hero}>
                <h1 style={styles.mainTitle}>SmartCharity</h1>
                <p style={styles.tagline}>
                    The world's first **AI-Driven** and **Cryptographically Verified** charity platform.
                    Building trust through transparency.
                </p>
                <div style={styles.ctaGroup}>
                    <Link to="/signup" style={styles.primaryBtn}>Get Started</Link>
                    <Link to="/login" style={styles.secondaryBtn}>Login to Impact</Link>
                </div>
            </header>

            {/* Features Section */}
            <section style={styles.features}>
                <div style={styles.featureCard}>
                    <span style={styles.icon}>🤖</span>
                    <h3>AI Impact Stories</h3>
                    <p>Gemini AI simplifies complex NGO reports into simple, donor-friendly summaries.</p>
                </div>
                <div style={styles.featureCard}>
                    <span style={styles.icon}>🛡️</span>
                    <h3>Audit Integrity</h3>
                    <p>Every donation is hashed using SHA-256, ensuring your money reaches the right cause.</p>
                </div>
                <div style={styles.featureCard}>
                    <span style={styles.icon}>🎫</span>
                    <h3>Donor Passport</h3>
                    <p>Earn badges, track streaks, and build your digital donor identity as you give.</p>
                </div>
            </section>

            {/* About Section */}
            <section style={styles.about}>
                <h2>Why SmartCharity?</h2>
                <p>
                    Traditional charity often lacks transparency. We bridge the gap using modern tech.
                    NGOs get tools to share their story, and Donors get proof of their impact.
                </p>
            </section>

            <footer style={styles.footer}>
                <p>&copy; 2026 SmartCharity Platform | Built for Transparency</p>
            </footer>
        </div>
    );
};

const styles = {
    container: { background: '#0a0a0a', color: 'white', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
    hero: { padding: '100px 20px', textAlign: 'center', background: 'radial-gradient(circle at center, #111 0%, #000 100%)' },
    mainTitle: { fontSize: '4rem', marginBottom: '20px', background: 'linear-gradient(to right, #4facfe, #00f2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800' },
    tagline: { fontSize: '1.2rem', color: '#888', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: '1.6' },
    ctaGroup: { display: 'flex', gap: '20px', justifyContent: 'center' },
    primaryBtn: { background: '#4facfe', color: 'white', padding: '15px 40px', borderRadius: '30px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' },
    secondaryBtn: { border: '1px solid #4facfe', color: '#4facfe', padding: '15px 40px', borderRadius: '30px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' },
    features: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', padding: '80px 40px', maxWidth: '1200px', margin: '0 auto' },
    featureCard: { background: '#111', padding: '40px', borderRadius: '20px', border: '1px solid #222', textAlign: 'center' },
    icon: { fontSize: '3rem', marginBottom: '20px', display: 'block' },
    about: { padding: '80px 20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' },
    footer: { padding: '40px', textAlign: 'center', color: '#444', borderTop: '1px solid #222' }
};

export default LandingPage;
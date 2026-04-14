import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

const SignupPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' });
    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();

    // AUTH GUARD: Redirect if already logged in
    useEffect(() => {
        if (user) navigate('/dashboard');
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await apiFetch('/api/auth/signup', {
                method: 'POST',
                body: JSON.stringify(formData),
            });
            login(data);
            alert("Signup successful!");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h2>Join SmartCharity</h2>
                <p>Start your journey as a donor or an NGO.</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    <input type="email" placeholder="Email Address" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    <input type="password" placeholder="Create Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />

                    <select onChange={(e) => setFormData({...formData, role: e.target.value})}>
                        <option value="USER">I am a Donor</option>
                        <option value="NGO_ADMIN">I represent an NGO</option>
                    </select>

                    <button type="submit" className="auth-btn">Create Account</button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
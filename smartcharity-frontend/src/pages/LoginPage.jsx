import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (user) navigate('/dashboard');
    }, [user, navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            login(data);
            navigate('/dashboard');
        } catch (err) {
            alert("Login Failed: " + err.message);
        }
    };
    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h2>Welcome Back</h2>
                <p>Login to manage your impact.</p>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="auth-btn">Login</button>
                </form>
                <div className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign up for free</Link>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;
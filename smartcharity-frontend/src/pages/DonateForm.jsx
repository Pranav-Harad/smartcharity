import { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

const DonateForm = () => {
    const { ngoId } = useParams();
    const { user } = useContext(AuthContext);
    const [amount, setAmount] = useState(100);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleDonate = async () => {
        setLoading(true);
        try {
            const donationData = {
                userId: user.userId,
                ngoId: ngoId,
                amount: amount,
                status: "PENDING"
            };

            const result = await apiFetch('/api/donations', {
                method: 'POST',
                body: JSON.stringify(donationData)
            });

            alert(`Success! Impact Story: ${result.impactStory}`);
            navigate('/dashboard');
        } catch (err) {
            alert("Donation failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="donate-container">
            <h2>Support this Cause</h2>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount (INR)"
            />
            <button onClick={handleDonate} disabled={loading}>
                {loading ? "Processing..." : `Donate ₹${amount}`}
            </button>
        </div>
    );
};

export default DonateForm;
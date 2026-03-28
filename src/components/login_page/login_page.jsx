import './login_page.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
const LoginPage = () => {
    const navigate = useNavigate();

    // 1. State
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleBackToHome = () => {
        navigate('/');
    };

    // 2. Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Handle form submit
    const handleSubmit = async () => {
        setError('');

        // Validation
        if (!formData.username || !formData.password) {
            setError('All fields are required');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Save user data to localStorage
                localStorage.setItem('teaUser', JSON.stringify(data.user));
                navigate('/dashboard'); // ✅ redirect after login
            } else {
                setError(data.message || 'Login failed');
            }

        } catch (err) {
            setError('Cannot connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="background-overlay"></div>
            <div className="login-content-wrapper">
                <div className="login-box">
                    <div className="back-home">
                        <button className="back-btn" onClick={handleBackToHome}>
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" fill="none" />
                            </svg>
                            <span>Back to Home</span>
                        </button>
                    </div>

                    <div className="login-header">
                        <div className="tea-icon-small">
                            <svg viewBox="0 0 64 64" width="60" height="60">
                                <path d="M50 18h-4v-4c0-2.2-1.8-4-4-4H22c-2.2 0-4 1.8-4 4v4h-4c-2.2 0-4 1.8-4 4v28c0 6.6 5.4 12 12 12h20c6.6 0 12-5.4 12-12V22c0-2.2-1.8-4-4-4zM22 14h20v4H22v-4zm28 36c0 4.4-3.6 8-8 8H22c-4.4 0-8-3.6-8-8V22h36v28z" fill="currentColor" />
                                <path d="M26 26h12v4H26z" fill="currentColor" />
                            </svg>
                        </div>
                        <h1 className="login-title">Sign In</h1>
                        <p className="login-subtitle">Welcome back to Tea Grade Classifier</p>
                    </div>

                    <div className="login-form">

                        {/* 4. Error message */}
                        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" viewBox="0 0 24 24" width="20" height="20">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Enter your username"
                                    className="input-field"
                                    value={formData.username}
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" viewBox="0 0 24 24" width="20" height="20">
                                    <path d="M17 11h-1V7A4 4 0 0 0 9 7v4H8a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2zM11 7a2 2 0 1 1 4 0v4h-4V7z" fill="currentColor" />
                                </svg>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    className="input-field"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button className="signin-btn" onClick={handleSubmit} disabled={loading}>
                            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                            <svg className="arrow-icon" viewBox="0 0 24 24" width="20" height="20">
                                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" />
                            </svg>
                        </button>

                        <div className="divider">
                            <span>or</span>
                        </div>

                        <div className="register-link">
                            <p>Don't have an account?</p>
                            <button className="register-btn">Create an account</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )

}
export default LoginPage;
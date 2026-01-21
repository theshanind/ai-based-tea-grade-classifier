import './register_page.css';
import { useNavigate } from 'react-router-dom';
const RegisterPage = () => {

    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/');
    }
    const handleBackToSignIn = () => {
        navigate('/login');
    };
    return (
        <div className="register-container">
            <div className="register-background-overlay"></div>

            <div className="register-content-wrapper">
                <div className="register-box">
                    <div className="register-back-home">
                        <button className="register-back-btn" onClick={handleBackToHome}>
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" fill="none" />
                            </svg>
                            <span>Back to Home</span>
                        </button>
                    </div>

                    <div className="register-header">
                        <h1 className="register-title">Create Account</h1>
                        <p className="register-subtitle">Join Tea Grade Classifier today</p>
                    </div>

                    <div className="register-form">
                        <div className="register-form-group">
                            <label htmlFor="name">Name</label>
                            <div className="register-input-wrapper">
                                <svg className="register-input-icon" viewBox="0 0 24 24" width="20" height="20">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter your full name"
                                    className="register-input-field"
                                />
                            </div>
                        </div>

                        <div className="register-form-group">
                            <label htmlFor="email">Email</label>
                            <div className="register-input-wrapper">
                                <svg className="register-input-icon" viewBox="0 0 24 24" width="20" height="20">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" fill="none" />
                                    <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    className="register-input-field"
                                />
                            </div>
                        </div>

                        <div className="register-form-group">
                            <label htmlFor="username">Username</label>
                            <div className="register-input-wrapper">
                                <svg className="register-input-icon" viewBox="0 0 24 24" width="20" height="20">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Choose a username"
                                    className="register-input-field"
                                />
                            </div>
                        </div>

                        <div className="register-form-group">
                            <label htmlFor="password">Password</label>
                            <div className="register-input-wrapper">
                                <svg className="register-input-icon" viewBox="0 0 24 24" width="20" height="20">
                                    <path d="M17 11h-1V7A4 4 0 0 0 9 7v4H8a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2zM11 7a2 2 0 1 1 4 0v4h-4V7z" fill="currentColor" />
                                </svg>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Create a password"
                                    className="register-input-field"
                                />
                            </div>
                        </div>

                        <button className="register-submit-btn">
                            <span>Create Account</span>
                            <svg className="register-arrow-icon" viewBox="0 0 24 24" width="20" height="20">
                                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" />
                            </svg>
                        </button>

                        <div className="register-divider">
                            <span>or</span>
                        </div>

                        <div className="register-signin-link">
                            <p>Already have an account?</p>
                            <button className="register-signin-btn" onClick={handleBackToSignIn}>
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default RegisterPage;
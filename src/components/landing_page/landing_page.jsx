import './landing_page.css';
import { useNavigate } from 'react-router-dom';
import image1 from '../../images/imageicon1.jpeg';
import image2 from '../../images/imageicon2.png';
import image3 from '../../images/imageicon3.png';



const LandingPage = () => {

    const navigate = useNavigate();

    const handleSignIn = () => {
        navigate('/login')
    };
    const handleRegister = () => {
        navigate('/register')
    };

    return (
        <div className="landing-container">
            <div className="landing-background-overlay"></div>
            <div className="landing-content-wrapper">
                <div className="landing-logo-section">
                    <div className="landing-tea-icon">
                        <svg viewBox="0 0 64 64" width="80" height="80">
                            <path d="M50 18h-4v-4c0-2.2-1.8-4-4-4H22c-2.2 0-4 1.8-4 4v4h-4c-2.2 0-4 1.8-4 4v28c0 6.6 5.4 12 12 12h20c6.6 0 12-5.4 12-12V22c0-2.2-1.8-4-4-4zM22 14h20v4H22v-4zm28 36c0 4.4-3.6 8-8 8H22c-4.4 0-8-3.6-8-8V22h36v28z" fill="currentColor" />
                            <path d="M26 26h12v4H26z" fill="currentColor" />
                        </svg>
                    </div>
                    <h1 className="landing-main-title">Tea Grade Classifier</h1>
                    <p className="landing-tagline">Precision Meets Tradition in Every Leaf</p>
                </div>

                <div className="landing-hero-section">
                    <p className="landing-description">
                        Experience the future of tea quality assessment with our advanced AI-powered grading system.
                        Ensuring excellence in every cup, one leaf at a time.
                    </p>
                </div>

                <div className="landing-cta-section">
                    <button className="landing-cta-btn landing-primary-btn" onClick={handleSignIn}>
                        <span>Sign In</span>
                        <svg className="landing-arrow-icon" viewBox="0 0 24 24" width="20" height="20">
                            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                    </button>
                    <button className="landing-cta-btn landing-secondary-btn" onClick={handleRegister}>
                        <span>Register</span>
                        <svg className="landing-arrow-icon" viewBox="0 0 24 24" width="20" height="20">
                            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                    </button>
                </div>

                <div className="landing-features-grid">
                    <div className="landing-feature-card">
                        <div className="landing-feature-icon">
                            <img src={image1} alt="Accurate Grading" />
                        </div>
                        <h3 className="landing-feature-title">Accurate Grading</h3>
                        <p className="landing-feature-text">AI-powered precision in tea quality assessment</p>
                    </div>

                    <div className="landing-feature-card">
                        <div className="landing-feature-icon">
                            <img src={image2} alt="Fast Results" />
                        </div>
                        <h3 className="landing-feature-title">Fast Results</h3>
                        <p className="landing-feature-text">Get instant grading reports in seconds</p>
                    </div>

                    <div className="landing-feature-card">
                        <div className="landing-feature-icon">
                            <img src={image3} alt="Detailed Analytics" />
                        </div>
                        <h3 className="landing-feature-title">Detailed Analytics</h3>
                        <p className="landing-feature-text">Comprehensive insights into tea quality metrics</p>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default LandingPage;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard_page.css';

const DashboardPage = () => {

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('analyze');
    const [rawTeaImage, setRawTeaImage] = useState(null);
    const [madeTeaImage, setMadeTeaImage] = useState(null);
    const [teaGrade, setTeaGrade] = useState('');

    const handleLogout = () => {
        navigate('/');
    };

    const handleRawTeaUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setRawTeaImage(URL.createObjectURL(file));
        }
    };

    const handleMadeTeaUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMadeTeaImage(URL.createObjectURL(file));
        }
    };

    const handleAnalyze = () => {
        console.log('Analyze button clicked');
        // Analysis logic will be implemented later
    };
    const handleCheckPrice = () => {
        console.log('Check price for grade:', teaGrade);
    };

    return (
        <div className="dash-container">
            <div className="dash-background-overlay"></div>

            <div className="dash-sidebar">
                <div className="dash-sidebar-header">
                    <h2 className="dash-brand">Tea Grade Classifier</h2>
                </div>

                <nav className="dash-nav">
                    <button
                        className={`dash-nav-item ${activeTab === 'analyze' ? 'active' : ''}`}
                        onClick={() => setActiveTab('analyze')}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                        <span>Analyze Tea</span>
                    </button>

                    <button
                        className={`dash-nav-item ${activeTab === 'price' ? 'active' : ''}`}
                        onClick={() => setActiveTab('price')}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                        <span>Auction Price</span>
                    </button>

                    <button
                        className={`dash-nav-item ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                        <span>History</span>
                    </button>
                </nav>

                <div className="dash-sidebar-footer">
                    <button className="dash-logout" onClick={handleLogout}>
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            <div className="dash-main">
                <div className="dash-content">
                    {activeTab === 'analyze' && (
                        <div className="dash-tab-content">
                            <div className="dash-page-header">
                                <h1 className="dash-page-title">Analyze Tea Grade</h1>
                                <p className="dash-page-subtitle">Upload tea images for AI-powered grading analysis</p>
                            </div>

                            <div className="dash-upload-container">
                                <div className="dash-upload-card">
                                    <div className="dash-card-header">
                                        <div className="dash-card-icon">
                                            <svg viewBox="0 0 24 24" width="24" height="24">
                                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3>Raw Tea Leaf</h3>
                                            <p>Upload image of raw tea leaves</p>
                                        </div>
                                    </div>

                                    <div className="dash-upload-area">
                                        {rawTeaImage ? (
                                            <div className="dash-preview">
                                                <img src={rawTeaImage} alt="Raw tea" />
                                                <button
                                                    className="dash-remove"
                                                    onClick={() => setRawTeaImage(null)}
                                                >
                                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" fill="none" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="dash-upload-label">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleRawTeaUpload}
                                                    className="dash-file-input"
                                                />
                                                <div className="dash-upload-icon">
                                                    <svg viewBox="0 0 24 24" width="48" height="48">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" fill="none" />
                                                    </svg>
                                                </div>
                                                <p className="dash-upload-text">Click to upload or drag and drop</p>
                                                <span className="dash-upload-hint">PNG, JPG up to 10MB</span>
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div className="dash-upload-card">
                                    <div className="dash-card-header">
                                        <div className="dash-card-icon">
                                            <svg viewBox="0 0 24 24" width="24" height="24">
                                                <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" stroke="currentColor" strokeWidth="2" fill="none" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3>Made Tea</h3>
                                            <p>Upload image of processed tea</p>
                                        </div>
                                    </div>

                                    <div className="dash-upload-area">
                                        {madeTeaImage ? (
                                            <div className="dash-preview">
                                                <img src={madeTeaImage} alt="Made tea" />
                                                <button
                                                    className="dash-remove"
                                                    onClick={() => setMadeTeaImage(null)}
                                                >
                                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" fill="none" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="dash-upload-label">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleMadeTeaUpload}
                                                    className="dash-file-input"
                                                />
                                                <div className="dash-upload-icon">
                                                    <svg viewBox="0 0 24 24" width="48" height="48">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" fill="none" />
                                                    </svg>
                                                </div>
                                                <p className="dash-upload-text">Click to upload or drag and drop</p>
                                                <span className="dash-upload-hint">PNG, JPG up to 10MB</span>
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="dash-action-bar">
                                <button className="dash-analyze-button" onClick={handleAnalyze}>
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" fill="none" />
                                    </svg>
                                    <span>Analyze Tea Grade</span>
                                </button>
                            </div>

                            <div className="dash-results-section">
                                <h2 className="dash-section-title">Analysis Results</h2>
                                <p className="dash-section-subtitle">ML model predictions will appear here after analysis</p>

                                <div className="dash-results-grid">
                                    <div className="dash-result-card">
                                        <div className="dash-result-header">
                                            <div>
                                                <h3>Raw Tea Analysis</h3>
                                                <p>Analysis from raw tea leaf image</p>
                                            </div>
                                            <span className="dash-badge pending">Pending</span>
                                        </div>

                                        <div className="dash-result-body">
                                            <div className="dash-metric">
                                                <span className="dash-metric-label">Grade</span>
                                                <span className="dash-metric-value">-</span>
                                            </div>
                                            <div className="dash-metric">
                                                <span className="dash-metric-label">Quality Score</span>
                                                <span className="dash-metric-value">-</span>
                                            </div>
                                            <div className="dash-metric">
                                                <span className="dash-metric-label">Confidence</span>
                                                <span className="dash-metric-value">-</span>
                                            </div>
                                            <div className="dash-metric">
                                                <span className="dash-metric-label">Color Index</span>
                                                <span className="dash-metric-value">-</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dash-result-card">
                                        <div className="dash-result-header">
                                            <div>
                                                <h3>Made Tea Analysis</h3>
                                                <p>Analysis from processed tea image</p>
                                            </div>
                                            <span className="dash-badge pending">Pending</span>
                                        </div>

                                        <div className="dash-result-body">
                                            <div className="dash-metric">
                                                <span className="dash-metric-label">Grade</span>
                                                <span className="dash-metric-value">-</span>
                                            </div>
                                            <div className="dash-metric">
                                                <span className="dash-metric-label">Quality Score</span>
                                                <span className="dash-metric-value">-</span>
                                            </div>
                                            <div className="dash-metric">
                                                <span className="dash-metric-label">Confidence</span>
                                                <span className="dash-metric-value">-</span>
                                            </div>
                                            <div className="dash-metric">
                                                <span className="dash-metric-label">Aroma Index</span>
                                                <span className="dash-metric-value">-</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'price' && (
                        <div className="dash-tab-content">
                            <div className="dash-page-header">
                                <h1 className="dash-page-title">Check Auction Price</h1>
                                <p className="dash-page-subtitle">Get current market prices for tea grades</p>
                            </div>

                            <div className="dash-price-container">
                                <div className="dash-price-card">
                                    <div className="dash-price-input-section">
                                        <label>Enter Tea Grade</label>
                                        <div className="dash-input-group">
                                            <input
                                                type="text"
                                                value={teaGrade}
                                                onChange={(e) => setTeaGrade(e.target.value)}
                                                placeholder="e.g., BOPF, OP, PEKOE"
                                                className="dash-price-input"
                                            />
                                            <button className="dash-price-btn" onClick={handleCheckPrice}>
                                                <svg viewBox="0 0 24 24" width="20" height="20">
                                                    <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" stroke="currentColor" strokeWidth="2" fill="none" />
                                                </svg>
                                                Check Price
                                            </button>
                                        </div>
                                    </div>

                                    <div className="dash-price-divider"></div>

                                    <div className="dash-price-result-section">
                                        <div className="dash-price-item">
                                            <span className="dash-price-label">Current Auction Price</span>
                                            <span className="dash-price-value">-</span>
                                        </div>
                                        <div className="dash-price-item">
                                            <span className="dash-price-label">Average Price (30 days)</span>
                                            <span className="dash-price-secondary">-</span>
                                        </div>
                                        <div className="dash-price-item">
                                            <span className="dash-price-label">Last Updated</span>
                                            <span className="dash-price-secondary">-</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="dash-tab-content">
                            <div className="dash-page-header">
                                <h1 className="dash-page-title">Analysis History</h1>
                                <p className="dash-page-subtitle">View your past tea grading analyses</p>
                            </div>

                            <div className="dash-history-container">
                                <div className="dash-empty-state">
                                    <svg viewBox="0 0 24 24" width="80" height="80">
                                        <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" fill="none" />
                                    </svg>
                                    <h3>No History Yet</h3>
                                    <p>Your analysis history will appear here once you start analyzing tea samples</p>
                                    <button className="dash-empty-action" onClick={() => setActiveTab('analyze')}>
                                        Start Analyzing
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default DashboardPage;
